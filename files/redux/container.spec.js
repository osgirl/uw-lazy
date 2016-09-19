import React from 'react';

import { expect } from 'chai';
import expectReactShallow from 'expect-react-shallow';

import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import TestRoot from 'components/root/root.test';
import Container from './container';

const getShallow = (props) => {
  return shallow(<TestRoot><Container /></TestRoot>);
};

describe('redux/modules/AddressPicker/container', () => {

  // it('works', () => {
  //   expect(true).to.be.equal(true);
  // });

});
