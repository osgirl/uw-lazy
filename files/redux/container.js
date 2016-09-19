import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from 'redux/modules';

// update the component name, path
import ComponentNameUI from 'components/modules/Component/Path/Name';

// update container name
const NameContainer = (props) =>
	<ComponentNameUI {...props} />;

// update container name
NameContainer.propTypes = {
	// postcode: React.PropTypes.string,
	// getAddresses: React.PropTypes.func.isRequired,
	// addresses: React.PropTypes.object.isRequired,
	// confirmAddress: React.PropTypes.func.isRequired,
};

export default connect(
	state => {
		// const applicationId = state.get('EntryForm').toJS().applicationId;
		return {
			...(state.get('Module').toJS()),
			// applicationId,
		};
	},


  dispatch => bindActionCreators({
	...actionCreators.ModuleName,
	getAddresses: actionCreators.ModuleName.getAddressesRequest,
	getAddressDetails: actionCreators.ModuleName.getAddressDetailsRequest,
  }, dispatch),
)(NameContainer);
