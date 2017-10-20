
// @flow
import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment/src/moment';

import CustomSelect from 'components/CustomSelect';
import RewardsPage from 'pages/Rewards';
import Tooltip from 'components/Tooltip';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Logo from 'images/sprite/logo.svg';

import { requestUser } from 'containers/App/sagas';
import {
  requestRewards,
  requestRedemptions,
  unlockReward,
  markAsRedeemed,
} from './sagas';

import './styles.scss';

type Props = {
  requestRedemptions: Function,
  requestRewards: Function,
  unlockReward: Function,
  markAsRedeemed: Function,
  requestUser: Function,
  redemptions: Object,
  rewards: Object,
  user: Object,
};

class RewardsDashboard extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      businessList: [{
        label: 'All',
        value: 'All',
      }],
      selectedBusiness: 'All',
    };
  }
  state: {
    businessList: Array<Object>,
    selectedBusiness: string,
  };
  componentDidMount() {
    this.props.requestUser();
    this.props.requestRedemptions();
    this.props.requestRewards();
  }
  componentWillReceiveProps(newProps: Props) {
    const { rewards } = this.props;
    let businessList = [];
    if (rewards.length === 0 && newProps.rewards.size > 0) {
      businessList = newProps.rewards.map((reward) => reward.getIn(['business', 'name'])).sort();
      businessList = businessList.insert(0, 'All');
      this.setState({
        businessList: businessList.map((item) => ({
          label: item,
          value: item,
        })).toJS(),
      });
    }
  }
  onChangeBusiness = (business: Object) => {
    this.setState({
      selectedBusiness: business.value,
    });
  }
  props: Props
  render() {
    const { user, redemptions, rewards } = this.props;
    const userLiftPoints = user && user.getIn(['pointWallet', 'balance'], 0);
    const unlockedRewardsTooltip = `These are your unlocked Rewards. Click Details for more
      information on Reward specifics, including how to redeem. Once you’ve actually used the
      Reward, click ‘Mark as Redeemed’ to move the Reward to the bottom of the list.`;
    const formatDate = (date) => moment(date).format('MMM DD YYYY');
    const isRewardsUser = user.get('rewardsEnabled');
    let filteredData = [];
    if (rewards.size > 0) {
      if (this.state.selectedBusiness === 'All') {
        filteredData = rewards;
      } else {
        filteredData = rewards.filter((item) => item.getIn(['business', 'name']) === this.state.selectedBusiness);
      }
    }
    return (
      <div>
        <Helmet title="My Rewards Dashboard" />

        {!isRewardsUser && <div className="row">
          <RewardsPage hideBreadcrumbs />
        </div>}

        {isRewardsUser && <div className="row">
          <div className="small-12 medium-4 column">
            <div className="rewardsCard">
              <h4 className="rewardsCard__title">My Lift Points</h4>
              <div className="pointsContainer">
                <Icon
                  glyph={Logo}
                  width={48}
                  height={30}
                  className="pointsContainer__logo"
                />
                <span className="pointsContainer__points">{userLiftPoints} pts</span>
              </div>
            </div>
            <div>
              <h3>
                <span>Unlocked Rewards</span>
                <Tooltip
                  tooltipPosition="top"
                  tooltipIndicator
                  tooltipContent={unlockedRewardsTooltip}
                >
                  <span className="tooltipPrompt">?</span>
                </Tooltip>
              </h3>
              {redemptions.map((redemption) => {
                const isRedeemedClass = redemption.get('redeemed') ? 'imgGrayscale' : '';
                const reward = redemption.get('reward', {});
                const business = reward.get('business', {});
                return (
                  <div
                    className={`column redemptionsRewardsCard ${isRedeemedClass}`}
                    key={redemption.get('id', '')}
                  >
                    <div className="row">
                      <div className="small-3">
                        <img
                          className="unlockedThumbnail"
                          src={reward.get('thumbnail')}
                          alt="Unlock Rewards"
                        />
                      </div>
                      <div className="small-9 discount-code">{redemption.get('code', '')}</div>
                    </div>
                    <div className="row">
                      <div className="medium-12 redemptionsRewardsCard__text">
                        <p className="nm">
                          {reward.get('title')} at&nbsp;
                          <Link
                            to={business.get('storeUrl')}
                            target="_blank"
                          >
                            {business.get('name')}
                          </Link>
                        </p>
                        <p className="nm">
                          <span><strong>Expires:</strong> {formatDate(reward.get('expiresOn'))}.</span>
                          <Modal
                            linkText={'Details'}
                            textIsButton={false}
                            content={`<h4>${reward.get('description')}</h4><p>${reward.get('terms')}</p>`}
                            title={'Lift Rewards™'}
                            isOpen={false}
                          />
                        </p>
                        <p>{reward.description}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        className="secondary"
                        onClick={() => this.props.markAsRedeemed(redemption)}
                      >
                        {redemption.get('redeemed', false) ? 'Redeemed' : 'Mark as Redeemed'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="small-12 medium-8 column">
            <div className="row mb-sm">
              <div className="column large-6 medium-12 small-12">
                <h3>Available Rewards</h3>
              </div>
              <div className="column small-12 medium-shrink">
                <label htmlFor="business">
                  Business:
                </label>
              </div>
              <div className="column">
                <CustomSelect
                  name="business"
                  className="large"
                  options={this.state.businessList}
                  value={this.state.selectedBusiness}
                  clearable={false}
                  onChange={this.onChangeBusiness}
                />
              </div>
            </div>
            {filteredData.map((reward) =>
              <div
                className="column availableRewardCard"
                key={reward.get('id')}
              >
                <div className="row">
                  <div className="medium-3 text-center">
                    <img
                      className="thumbnailImage"
                      src={reward.get('thumbnail')}
                      alt="Rewards "
                    />
                  </div>
                  <div className="medium-9">
                    <div className="column">
                      <div className="medium-12">
                        <h4 className="nm">{reward.get('title')}</h4>
                        <p className="nm">at&nbsp;
                          <Link
                            to={reward.getIn(['business', 'storeUrl'], '')}
                            target="_blank"
                          >
                            {reward.getIn(['business', 'name'], '')}
                          </Link>
                        </p>
                        <p className="nm">{reward.get('description')}</p>
                        <p className="nm">
                          <span><strong>Expires:</strong> {formatDate(reward.get('expiresOn'))}.</span>
                          <Modal
                            linkText={'Details'}
                            textIsButton={false}
                            content={`
                            <h2>${reward.get('description')}</h2>
                            <h3>${reward.get('terms')}</h3>
                          `}
                            title={'Lift Rewards™'}
                            isOpen={false}
                          />
                        </p>
                      </div>
                      <div className="medium-12 pullRight">
                        <span className="rewardsPointsTotal">{reward.get('price')} pts</span>&nbsp;
                        <Modal
                          linkText={'Unlock'}
                          textIsButton
                          isUnlockModal
                          unlockFunction={() => this.props.unlockReward(reward)}
                          content={`
                            <h2>Unlock this ${reward.getIn(['business', 'name'], '')} Reward?</h2>
                            <h3>This will cost you ${reward.get('price', '')} Lift Points.  Your Reward code will appear under Unlocked Rewards.</h3>
                          `}
                          title={'Lift Rewards™'}
                          isOpen={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.getIn(['app', 'user'], {}),
  rewards: state.getIn(['dashboard', 'rewards', 'data'], []),
  redemptions: state.getIn(['dashboard', 'redemptions', 'data'], []),
});
const mapDispatchToProps = (dispatch) => ({
  requestRewards: () => dispatch(requestRewards()),
  requestRedemptions: () => dispatch(requestRedemptions()),
  unlockReward: (payload) => dispatch(unlockReward(payload)),
  markAsRedeemed: (payload) => dispatch(markAsRedeemed(payload)),
  requestUser: () => dispatch(requestUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RewardsDashboard);
