import Immutable from 'immutable';

import {
GET_NAME_REQUEST,
GET_NAME_LOADING,
GET_NAME_SUCCESS,
GET_NAME_FAILURE,
} from './constants';

const initialState = Immutable.fromJS({
  // addresses: {},
  // addressDetails: {},
});

export default function counter(state = initialState, action) {
  switch (action.type) {

    /**
     * GET_NAME_*
     */

		case GET_NAME_REQUEST:
      return state.mergeDeep({ addresses: { [action.postcode]: 'request' } });

    case GET_NAME_LOADING:
      return state.mergeDeep({ addresses: { [action.postcode]: 'loading' } });

    case GET_NAME_SUCCESS:
      return state.mergeDeep({ addresses: { [action.postcode]: action.addresses } });

    case GET_NAME_FAILURE:
      return state.mergeDeep({ addresses: { [action.postcode]: action.error } });

    default:
      return state;
  }
}
