// @flow
import React from 'react';
import TagList, { TagItem } from 'components/TagList';
import ImageLabel from 'components/ImageLabel';

import IconVape from 'images/sprite/vape.svg';
import IconJoint from 'images/sprite/joint.svg';
import IconBong from 'images/sprite/bong.svg';
import IconEdibles from 'images/sprite/edibles.svg';
import IconMorning from 'images/sprite/morning.svg';
import IconDaytime from 'images/sprite/daytime.svg';
import IconEvening from 'images/sprite/evening.svg';

import EffectSection from './EffectSection';
import './styles.scss';

const iconList = {
  vaporizer: IconVape,
  joint: IconJoint,
  bong: IconBong,
  edibles: IconEdibles,
  morning: IconMorning,
  daytime: IconDaytime,
  evening: IconEvening,
};

type Props = {
  data: Object,
};
const ItemDetail = ({ data }: Props) => {
  const prescribedFor = data.get('prescribedFor') ? data.get('prescribedFor').toJS() : [];
  const symptomsHelped = data.get('symptomsHelped') ? data.get('symptomsHelped').toJS() : [];
  const positiveEffects = data.get('positiveEffects') ? data.get('positiveEffects').toJS() : [];
  const negativeEffects = data.get('negativeEffects') ? data.get('negativeEffects').toJS() : [];
  const flavours = data.get('flavours') ? data.get('flavours').toJS() : [];
  const duration = data.get('duration');

  const methodOfConsumption = data.get('methodOfConsumption');
  const timeOfConsumption = data.get('timeOfConsumption');
  let methodOfConsumptionIcon = null;
  let timeOfConsumptionIcon = null;

  if (methodOfConsumption) {
    methodOfConsumptionIcon = iconList[methodOfConsumption];
  }
  if (timeOfConsumption) {
    timeOfConsumptionIcon = iconList[timeOfConsumption];
  }
  return (
    <div>
      {prescribedFor && prescribedFor.length > 0 &&
        <div className="row mb-md">
          <div className="column">
            <div className="mb-md fs-mx">
              Conditions
            </div>
            <TagList
              values={prescribedFor}
              readOnly
            />
          </div>
        </div>
      }
      <EffectSection
        data={symptomsHelped}
        title="Symptoms"
      />
      <EffectSection
        data={positiveEffects}
        title="Positive Effects"
      />
      <EffectSection
        data={negativeEffects}
        title="Negative Effects"
      />
      {flavours && flavours.length > 0 &&
        <div className="row mb-md">
          <div className="column">
            <div className="mb-md fs-mx">
              Flavours
            </div>
            <TagList
              values={flavours}
              readOnly
            />
          </div>
        </div>
      }
      <div className="row mb-md">
        {methodOfConsumptionIcon &&
          <ImageLabel
            title="Method of Consumption"
            className="column small-12 medium-4"
            icon={methodOfConsumptionIcon}
            name={methodOfConsumption}
          >
            <span>{methodOfConsumption}</span>
          </ImageLabel>
        }

        {timeOfConsumptionIcon &&
          <ImageLabel
            title="Time of Day Consumed"
            className="column small-12 medium-4"
            icon={timeOfConsumptionIcon}
            name={timeOfConsumption}
          >
            <span>{timeOfConsumption}</span>
          </ImageLabel>
        }

        {duration &&
          <div className="column small-12 medium-4">
            <div className="mb-sm fs-mx">
              Duration
            </div>
            <TagItem
              value={duration}
              readOnly
            />
          </div>
        }
      </div>
    </div>
  );
};

export default ItemDetail;
