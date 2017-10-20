// @flow

import React, { Component } from 'react';
import type { List } from 'immutable';
import { fromJS } from 'immutable';
import { Accordion, AccordionItem } from 'react-foundation-components/lib/global/accordion';

import BorderedTitle from 'components/BorderedTitle';
import './styles.scss';

type Props = {
  questions: List<Object>,
  title?: string,
}

class Faq extends Component {
  state = {
    activeKey: '1',
  }
  handleSingleSelect = (activeKey: string) => this.setState({ activeKey });
  props: Props
  render() {
    const { questions, title } = this.props;
    const { activeKey } = this.state;
    return (
      <div className="faq">
        <BorderedTitle>{title || 'FAQ'}</BorderedTitle>
        {questions.entrySeq().map(([key, item]) => {
          const question = item.get('question', '');
          const a = item.get('answer');
          const answers = (typeof a === 'string') ? fromJS([a]) : a;
          return (
            <div
              className="small-12"
              key={key}
            >
              <Accordion
                activeKey={activeKey}
                onSelect={this.handleSingleSelect}
              >
                <AccordionItem
                  eventKey={key}
                  title={question}
                >
                  {answers.entrySeq().map(([answerkey, answer]) =>
                    <p key={answerkey}>{answer}</p>
                  )}
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Faq;
