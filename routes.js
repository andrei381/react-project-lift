// @flow

// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import type { Store } from 'types/common';
import storage from 'store';
import { INTERCOM_APP_ID } from 'containers/constants';
import { EventTypes } from 'redux-segment';
import moment from 'moment';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  if (componentModule) {
    cb(null, componentModule.default);
  }
};

const USER_IDENTITY = 'Lift/User/USER_IDENTITY';

export default function createRoutes(store: Store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  const createRoute = (path: string,
    name: string,
    component: Promise<Object>,
    sagas: ?Promise<Object> = null,
    cancelSagas: boolean = false,
    indexComponent: ?Promise<Object> = null, // Index component is the component which will be used in index route
    childRoutes: Array<Object> = [],
    requiredAuth: boolean = false,
  ) => {
    type Route = {
      path: string,
      name: string,
      getComponent: Function,
      onEnter?: Function,
      onLeave?: Function,
      loadedSagas?: Array<Object>,
      indexRoute?: Object,
      childRoutes?: Array<Object>,
    }

    const route: Route = {
      path,
      name,
      getComponent(nextState: Object, cb: Function) {
        const importModules = Promise.all([component, sagas]);
        const renderRoute = loadModule(cb);
        importModules.then(([loadedComponent, loadedSagas]) => {
          if (loadedSagas) {
            injectReducer(name, loadedSagas.reducer); // a saga module must export the reducer as `export const reducer = (...) => ...`
          }
          renderRoute(loadedComponent);
        });
        importModules.catch(errorLoading);
      },
      childRoutes,
    };

    route.onEnter = function onEnter(nextState: Object, replace: Function, callback: Function) {
      // onEnter gets called when we visit a route
      // childRoute changes do not trigger onEnter, which is a desired behavior
      if (sagas) {
        const importModules = sagas;
        if (importModules != null) {
          importModules.then((importedSagas) => {
            this.loadedSagas = injectSagas(importedSagas.default);
            callback();
          });
          importModules.catch(errorLoading);
        }
      }

      if (requiredAuth && !storage.get('user')) {
        replace('/login');
      }

      if (storage.get('user')) {
        const user = storage.get('user');
        window.Intercom('boot', {
          app_id: INTERCOM_APP_ID,
          name: user.username,
          email: user.email,
          created_at: user.joindate,
        });
        window.Intercom('update');
        store.dispatch({
          type: USER_IDENTITY,
          meta: {
            analytics: [
              {
                eventType: EventTypes.identify,
                eventPayload: {
                  traits: {
                    name: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    avatar: user.gravatarPicture,
                    createdAt: moment(user.createdOn).toDate(),
                    birthday: moment(user.birthday).toDate(),
                    description: user.bio,
                    age: moment().diff(moment(user.birthday), 'years'),
                  },
                  userId: user.id,
                },
              },
            ],
          },
        });
      } else {
        window.Intercom('boot', {
          app_id: INTERCOM_APP_ID,
        });
      }
      callback();
    }.bind(route);
    if (cancelSagas) {
      route.onLeave = function onLeave() {
      // onLeave gets called when we leave the route
      // Cancel the sagas if they are running
        if (this.loadedSagas) {
          this.loadedSagas.forEach((saga) => saga.cancel());
          delete this.loadedSagas;
        }
      }.bind(route);
    }

    if (indexComponent) {
      route.indexRoute = {
        getComponent(partialNextState: Object, cb: Function) {
          const importModules = Promise.all([
            indexComponent,
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([loadedParentComponent]) => {
            renderRoute(loadedParentComponent);
          });

          importModules.catch(errorLoading);
        },
      };
    }
    if (childRoutes) {
      route.childRoutes = childRoutes;
    }
    return route;
  };

  const childRoutes = [
    createRoute(
      '/',
      'home',
      import('pages/Home'),
      import('pages/Home/sagas')
    ),
    createRoute(
      '/advice',
      'advice',
      import('pages/Advice'),
      import('pages/Advice/sagas')
    ),
    createRoute(
      '/advice/create-question', // Must be on top of '/advice/:slug'
      'adviceCreateQuestion',
      import('pages/Advice/CreateQuestion'),
      import('pages/Advice/CreateQuestion/sagas')
    ),
    createRoute(
      '/advice/:slug',
      'advice',
      import('pages/Advice'),
      import('pages/Advice/sagas')
    ),
    createRoute(
      '/advice/:categorySlug/:questionSlug',
      'adviceQuestion',
      import('pages/Advice/Question'),
      import('pages/Advice/Question/sagas')
    ),
    createRoute(
      '/shop',
      'shop',
      import('pages/Shop'),
      import('pages/Shop/sagas')
    ),
    createRoute(
      '/strains',
      'search',
      import('pages/Strains'),
      import('containers/Search/sagas')
    ),
    createRoute(
      '/strains/:slug',
      'product',
      import('pages/Product'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/About'),
      [
        createRoute(
          'about',
          'productAbout',
          import('pages/Product/About'),
        ),
        createRoute(
          '/strains/:slug/reviews',
          'productReview',
          import('pages/Product/Reviews'),
        ),
        createRoute(
          '/strains/:slug/comments',
          'productComment',
          import('pages/Product/Comments'),
        ),
      ],
    ),
    createRoute(
      '/strains/:slug/reviews/:id',
      'product',
      import('pages/Product/Review'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/Review/View'),
      [
        createRoute(
          'view',
          'productReview',
          import('pages/Product/Review/View'),
        ),
        createRoute(
          'edit',
          'productReviewEdit',
          import('pages/Product/Review/Edit'),
        ),
      ]
    ),
    createRoute(
      '/strains/:slug/create-review',
      'product',
      import('pages/Product/ReviewForm'),
      import('containers/Product/sagas')
    ),
    createRoute(
      '/products',
      'search',
      import('pages/Products'),
      import('containers/Search/sagas'),
    ),
    createRoute(
      '/products/:slug',
      'product',
      import('pages/Product'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/About'),
      [
        createRoute(
          'about',
          'productAbout',
          import('pages/Product/About'),
        ),
        createRoute(
          'reviews',
          'productReview',
          import('pages/Product/Reviews'),
        ),
        createRoute(
          'comments',
          'productComment',
          import('pages/Product/Comments'),
        ),
      ],
    ),
    createRoute(
      '/products/:slug/reviews/:id',
      'product',
      import('pages/Product/Review'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/Review/View'),
      [
        createRoute(
          'view',
          'productReview',
          import('pages/Product/Review/View'),
        ),
        createRoute(
          'edit',
          'productReviewEdit',
          import('pages/Product/Review/Edit'),
        ),
      ]
    ),
    createRoute(
      '/products/:slug/create-review',
      'product',
      import('pages/Product/ReviewForm'),
      import('containers/Product/sagas'),
    ),
    createRoute(
      '/oils',
      'search',
      import('pages/Oils'),
      import('containers/Search/sagas')
    ),
    createRoute(
      '/oils/:slug',
      'product',
      import('pages/Product'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/About'),
      [
        createRoute(
          'about',
          'productAbout',
          import('pages/Product/About'),
        ),
        createRoute(
          'reviews',
          'productReview',
          import('pages/Product/Reviews'),
        ),
        createRoute(
          'comments',
          'productComment',
          import('pages/Product/Comments'),
        ),
      ],
    ),
    createRoute(
      '/oils/:slug/reviews/:id',
      'product',
      import('pages/Product/Review'),
      import('containers/Product/sagas'),
      false,
      import('pages/Product/Review/View'),
      [
        createRoute(
          'view',
          'productReview',
          import('pages/Product/Review/View'),
        ),
        createRoute(
          'edit',
          'productReviewEdit',
          import('pages/Product/Review/Edit'),
        ),
      ]
    ),
    createRoute(
      '/oils/:slug/create-review',
      'product',
      import('pages/Product/ReviewForm'),
      import('containers/Product/sagas')
    ),
    createRoute(
      '/register',
      'auth',
      import('pages/Register')
    ),
    createRoute(
      '/login',
      'auth',
      import('pages/Login')
    ),
    createRoute(
      '/reset-password',
      'resetPassword',
      import('pages/ResetPassword'),
      import('pages/ResetPassword/sagas')
    ),
    createRoute(
      '/change-password',
      'changePassword',
      import('pages/ChangePassword'),
      import('pages/ChangePassword/sagas')
    ),
    createRoute(
      '/privacy',
      'privacy',
      import('pages/PrivacyPage'),
    ),
    createRoute(
      '/find',
      'find',
      import('pages/Find')
    ),
    createRoute(
      '/rewards',
      'app',
      import('pages/Rewards'),
      import('containers/App/sagas')
    ),
    createRoute(
      '/doctors',
      'businessSearch',
      import('pages/Doctors'),
      import('containers/BusinessSearch/sagas')
    ),
    createRoute(
      '/dispensaries',
      'businessSearch',
      import('pages/Dispensaries'),
      import('containers/BusinessSearch/sagas')
    ),
    createRoute(
      '/producers',
      'businessSearch',
      import('pages/Producers'),
      import('containers/BusinessSearch/sagas')
    ),
    createRoute(
      '/doctors/:slug',
      'profile',
      import('pages/Doctor'),
      import('containers/BusinessProfile/sagas'),
      false,
      import('pages/Doctor/About'),
      [
        createRoute(
          'about',
          'doctorAbout',
          import('pages/Doctor/About'),
        ),
        createRoute(
          'reviews',
          'doctorReviews',
          import('pages/Doctor/ReviewList'),
        ),
        createRoute(
          'comments',
          'doctorComments',
          import('pages/Doctor/Comment'),
        ),
        createRoute(
          'products',
          'doctorProducts',
          import('pages/Doctor/ProductList'),
        ),
      ],
    ),
    createRoute(
      '/dispensaries/:slug',
      'profile',
      import('pages/Dispensary'),
      import('containers/BusinessProfile/sagas'),
      false,
      import('pages/Dispensary/About'),
      [
        createRoute(
          'about',
          'dispensaryAbout',
          import('pages/Dispensary/About'),
        ),
        createRoute(
          'reviews',
          'dispensaryReviews',
          import('pages/Dispensary/ReviewList'),
        ),
        createRoute(
          'comments',
          'dispensaryComments',
          import('pages/Dispensary/Comment'),
        ),
        createRoute(
          'products',
          'dispensaryProducts',
          import('pages/Dispensary/ProductList'),
        ),
      ],
    ),
    createRoute(
      '/producers/:slug',
      'profile',
      import('pages/Producer'),
      import('containers/BusinessProfile/sagas'),
      false,
      import('pages/Producer/About'),
      [
        createRoute(
          'about',
          'producerAbout',
          import('pages/Producer/About'),
        ),
        createRoute(
          'reviews',
          'producerReviews',
          import('pages/Producer/ReviewList'),
        ),
        createRoute(
          'comments',
          'producerComments',
          import('pages/Producer/Comment'),
        ),
        createRoute(
          'products',
          'producerProducts',
          import('pages/Producer/ProductList'),
        ),
      ]
    ),
    createRoute(
      '/members/:slug',
      'memberProfile',
      import('pages/MemberProfile'),
      import('containers/MemberProfile/sagas'),
    ),
    createRoute(
      '/members/:slug/following',
      'memberProfile',
      System.import('pages/MemberProfile/Following'),
      System.import('containers/MemberProfile/sagas'),
    ),
    createRoute(
      '/members/:slug/reviews',
      'memberProfile',
      import('pages/MemberProfile/Reviews'),
      import('containers/MemberProfile/sagas'),
    ),
    createRoute(
      '/me',
      'me',
      import('pages/Profile'),
      null,
      false,
      import('pages/MyProfile'),
      [
        createRoute(
          '/me/edit',
          'edit',
          import('pages/MyProfile')
        ),
        createRoute(
          '/me/reviews',
          'myreviews',
          import('pages/MyReviews'),
          import('pages/MyReviews/sagas'),
        ),
        createRoute(
          '/me/rewards',
          'dashboard',
          import('pages/RewardsDashboard'),
          import('pages/RewardsDashboard/sagas'),
        ),
      ],
      true,
    ),
    createRoute(
      '504',
      '504',
      import('pages/504')
    ),
    createRoute(
      '/doctors/:slug/reviews/:id',
      'profile',
      import('pages/Doctor/Review'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/dispensaries/:slug/reviews/:id',
      'profile',
      import('pages/Dispensary/Review'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/producers/:slug/reviews/:id',
      'profile',
      import('pages/Producer/Review'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/doctors/:slug/reviews/:id/edit',
      'profile',
      import('pages/Doctor/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/dispensaries/:slug/reviews/:id/edit',
      'profile',
      import('pages/Dispensary/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/producers/:slug/reviews/:id/edit',
      'profile',
      import('pages/Producer/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/doctors/:slug/create-review',
      'profile',
      import('pages/Doctor/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/dispensaries/:slug/create-review',
      'profile',
      import('pages/Dispensary/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/producers/:slug/create-review',
      'profile',
      import('pages/Producer/ReviewForm'),
      import('containers/BusinessProfile/sagas')
    ),
    createRoute(
      '/how-it-works',
      'howItWorks',
      import('pages/HowItWorks'),
    ),
    createRoute(
      '/about',
      'about',
      import('pages/AboutPage'),
    ),
    createRoute(
      '/create-review',
      'createReview',
      import('pages/CreateReview'),
      import('pages/CreateReview/sagas'),
    ),
    createRoute(
      '/go',
      'createReview',
      import('pages/Go'),
      import('pages/CreateReview/sagas')
    ),
    createRoute(
      '/go/login',
      'auth',
      import('pages/Go/Login')
    ),
    createRoute(
      '/go/register',
      'auth',
      import('pages/Go/Register')
    ),
    createRoute(
      '/terms-and-conditions',
      'termsAndConditions',
      import('pages/TermsAndConditions')
    ),
    createRoute(
      '*',
      'notfound',
      import('pages/404')
    ),
  ];

  return {
    getComponent(nextState: Object, cb: Function) {
      const importModules = Promise.all([
        import('containers/App/sagas'),
        import('containers/App'),
      ]);

      const renderRoute = loadModule(cb);

      importModules.then(([sagas, component]) => {
        injectReducer('app', sagas.reducer);
        injectSagas(sagas.default);
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
    childRoutes,
  };
}
