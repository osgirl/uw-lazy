import {

GET_NAME_REQUEST,
GET_NAME_SUCCESS,
GET_NAME_LOADING,
GET_NAME_FAILURE,

} from './constants';

/**
 * GET_NAME [CHANGE NAME]
 */
export const getNameRequest = (postcode) => ({
	type: GET_NAME_REQUEST,
	postcode,
});

export const getNameLoading = (postcode) => ({
	type: GET_NAME_LOADING,
	postcode,
});

export const getNameSuccess = (response, postcode, addresses) => ({
	type: GET_NAME_SUCCESS,
	addresses,
	postcode,
});

export const getNameFailure = (error, postcode) => ({
	type: GET_NAME_FAILURE,
	error,
	postcode,
});
