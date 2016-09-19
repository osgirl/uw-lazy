/* eslint-disable no-constant-condition */
/* eslint-disable brace-style */
/* eslint-disable no-use-before-define */

import { takeEvery, takeLatest } from 'redux-saga';
import { call, put, select, take, cancel, fork } from 'redux-saga/effects';

import {

// GET_NAME_REQUEST,
// GET_NAME_LOADING,
// GET_NAME_SUCCESS,
// GET_NAME_FAILURE,

} from './constants';

import * as actions from './actions';

// import fetchAddressesService from 'redux/services/getSearchAddressPostcode';
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function* combinedSagas() {
	// yield fork(
  //   takeLatest,
  //   GET_ADDRESS_DETAILS_REQUEST,
  //   handleGetAddressDetails,
  // );
}
/**
 * handleGetAddressDetails search task
 * @param  {string} postcode
 */

export function* handleGetAddressDetails(action) {
  // console.log ('saga handleGetAddressDetails', action);
	const { uuid } = action;
  if (uuid) {
    yield put(actions.getAddressDetailsLoading(uuid));
    try {
      const response = yield call(fetchAddressDetailsService, uuid);
      const data = response.data;
      yield put(actions.getAddressDetailsSuccess(response, uuid, data));
    }
    catch (error) {
      yield put({ type: GET_ADDRESS_DETAILS_FAILURE, error: 'connection_error', uuid });
    }
  }
}
