// @flow

import React, { Component } from 'react';

import CustomSelect from 'components/CustomSelect';
import transformOptions from 'utils/transformOptions';

type Props = {
  birthday: Date,
}
type State = {
  year: string,
  month: string,
  day: string,
}
class DatePicker extends Component {
  constructor(props: Props) {
    super(props);
    const month = props.birthday.getMonth() + 1;
    this.state = {
      year: props.birthday.getFullYear().toString(),
      month: month.toString(),
      day: props.birthday.getDate().toString(),
    };
  }
  state: State
  getMonthValues = () => {
    const months = [];
    for (let i = 1; i <= 12; i += 1) {
      months.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return months;
  }

  getDateValues = () => {
    const dates = [];
    for (let i = 1; i <= 31; i += 1) {
      dates.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return dates;
  }

  getYearValues = () => {
    const years = [];
    for (let i = 1900; i <= 2050; i += 1) {
      years.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return years;
  }

  props: Props
  render() {
    const { year, month, day } = this.state;
    return (
      <div
        className="datePicker row"
      >
        <div className="column medium-4 small-12">
          <label htmlFor="birthday">Month</label>
          <CustomSelect
            className="large"
            value={month}
            clearable={false}
            options={this.getMonthValues()}
            placeholder="Select Month"
            onChange={(e) => {
              this.setState({
                month: e,
              });
            }}
          />
        </div>
        <div className="column medium-4 small-12">
          <label htmlFor="birthday">Day</label>
          <CustomSelect
            className="large"
            value={day}
            clearable={false}
            options={this.getDateValues()}
            placeholder="Select Day"
            onChange={(e) => {
              this.setState({
                day: e,
              });
            }}
          />
        </div>
        <div className="column medium-4 small-12">
          <label htmlFor="birthday">Year</label>
          <CustomSelect
            className="large"
            value={year}
            clearable={false}
            options={this.getYearValues()}
            placeholder="Select Year"
            onChange={(e) => {
              this.setState({
                year: e,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
