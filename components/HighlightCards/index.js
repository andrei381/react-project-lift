// @flow

import React from 'react';
import { Link } from 'react-router';
import type { List } from 'immutable';
import BorderedTitle from 'components/BorderedTitle';
import Button from 'components/Button';
import './styles.scss';

type Props = {
  cards: List<Object>,
}

const HighlightCards = ({ cards }: Props) => (
  <div className="row column">
    <div className="highlightCard row">
      {cards.entrySeq().map(([key, item]) => {
        const src = item.get('src', '');
        const title = item.get('title', '');
        const desc = item.get('desc', '');
        const btnText = item.get('btnText', '');
        const linkTo = item.get('linkTo', '');
        const icon = item.get('icon', '');
        return (
          <div
            className="highlightCard__item small-12 medium-4 column"
            key={key}
          >
            <Link to={linkTo}>
              <img
                className="mb-lg"
                src={src}
                alt={title}
              />
            </Link>
            <Link
              className="highlightCard__title"
              to={linkTo}
            >
              <BorderedTitle
                element="h2"
                className="borderedTitle"
                leftAligned
              >
                {icon && <img
                  src={icon}
                  alt="Number Icon"
                  className="highlightCard__icon"
                />}
                {title}
              </BorderedTitle>
            </Link>
            <p>{desc}</p>
            {btnText &&
              <Button
                element={Link}
                className="secondary"
                to={linkTo}
              >
                {btnText}
              </Button>
            }
          </div>
        );
      })}
    </div>
  </div>
);

export default HighlightCards;
