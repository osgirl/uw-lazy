import React from 'react';
import Radium from 'radium';

import styles from './styles';

/**
 * @class :Component:
 * @prop {type} name Name of the component
 */
class :Component: extends React.Component {

	static defaultProps = {
		name: ':Component:',
	}

	render() {

		const {
		  name,
		} = this.props;

		return (
		  <div style={styles.base}>
		    <h3>New React Component: {name}</h3>
		  </div>
		);
	}
}
NewComponent.propTypes = {
	name: React.PropTypes.string,
};
export default :Component:;
// export default Radium(:Component:);
