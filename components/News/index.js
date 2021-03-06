// @flow

import React from 'react';
import { generate } from 'shortid';

import TimeAgo from 'components/TimeAgo';
import type { List } from 'immutable';

import './styles.scss';

type Props = {
  data: List<Object>,
};

const News = ({ data }: Props) => (
  <div className="row column">
    <div className="news">
      <div className="row">
        <div className="small-12 column">
          <h2 className="mb-lg">Recent Articles</h2>
        </div>
        <div className="small-12 column">
          <h3 className="mb-lg">The latest cannabis news and content</h3>
        </div>
        {data && data.map((item) => {
          const title = item.get('title', '');
          const author = item.getIn(['author', 'name'], '');
          const thumbnail = item.getIn(['featured_image', 'attachment_meta', 'sizes', 'xt-large', 'url'], ['featured_image', 'attachment_meta', 'sizes', 'xt-medium', 'url']);
          const avatar = item.getIn(['author', 'avatar'], 'https://news.lift.co/wp-content/uploads/avatars/49/58b34f39c4374-bpfull.jpg');
          const articleUrl = item.get('link', '');
          const timeAgo = item.get('modified', '');
          const category = item.getIn(['terms', 'category', 0]);
          return (
            <div
              className="news__item small-12 medium-4 column"
              key={generate()}
            >
              <div className="news__image text-center">
                <a
                  href={articleUrl}
                  target="_blank"
                >
                  <img
                    src={thumbnail}
                    alt={title}
                  />
                </a>
                <div className="news__category">
                  {category.get('name')}
                </div>
              </div>
              <a
                className="news__title"
                href={articleUrl}
                target="_blank"
              >
                <h4>{title}</h4>
              </a>
              <div className="row align-middle">
                <div className="shrink column npr">
                  <img
                    className="news__avatar"
                    src={avatar}
                    alt={author}
                  />
                </div>
                <div className="shrink column"><div className="news__author">{author}</div></div>
                <div className="shrink column">
                  <TimeAgo data={timeAgo} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default News;
