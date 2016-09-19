import React from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';

import Header from 'modules/layout/Header';
import PageTitle from 'modules/LandingPage/PageTitle';
import SectionCentered from 'modules/layout/SectionCentered';
import Footer from 'modules/layout/Footer';

import styles from './styles';

import MVPNavigation from 'modules/Shared/MVPNavigation';

/**
 * @class PageComponent
 */
class PageComponent extends React.Component {

  static defaultProps = {
    name: 'default name'
  }

  render() {
    //
    const {
      name,
    } = this.props;

    return (
      <div style={styles.base}>
        <Header {...this.props} />

        <Helmet
          title="Page title..."
        />

        <SectionCentered style={styles.heroBackground}>
          <PageTitle title={'Page title...'} />
        </SectionCentered>

        <SectionCentered style={styles.mainContent}>
          SectionCentered content
        </SectionCentered>

        {false &&
          <SectionCentered style={{ backgroundColor: '#ccff99'}}>
            <MVPNavigation currentPage="/pageurl" />
          </SectionCentered>
        }

        <SectionCentered showMargin={false} style={{ backgroundColor: '#440459' }}>
          <Footer

          />
        </SectionCentered>
      </div>
    );
  }
}
PageComponent.propTypes = {
  // name: React.PropTypes.string,
};
export default PageComponent;
// export default Radium(PageComponent);
