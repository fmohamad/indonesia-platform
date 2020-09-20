import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import kebabCase from 'lodash/kebabCase';
import { Dropdown, Icon, Loading } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import PlayTimeline from 'components/play-timeline';
import Map from 'components/map';
import DotLegend from 'components/dot-legend';
import AdaptationProvider from 'providers/adaptation-provider';
import EmissionActivitiesProvider from 'providers/emission-activities-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import MetadataProvider from 'providers/metadata-provider';
import dropdownStyles from 'styles/dropdown.scss';
import MapTooltip from './map-tooltip';
import agriculture_color from 'assets/icons/agriculture_color';
import agriculture_white from 'assets/icons/agriculture_white';
import energy_color from 'assets/icons/energy_color';
import energy_white from 'assets/icons/energy_white';
import forestry_color from 'assets/icons/forestry_color';
import forestry_white from 'assets/icons/forestry_white';
import industry_color from 'assets/icons/industry_color';
import industry_white from 'assets/icons/industry_white';
import waste_color from 'assets/icons/waste_color';
import waste_white from 'assets/icons/waste_white';

import styles from './emission-map-styles.scss';

const MAP_CENTER = [ 115, -4 ];

class EmissionMap extends Component {
  constructor() {
    super();
    this.state = { disablePlay: false, active: false };
  }

  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: selected });
  };

  handlePlay = () => {
    const { selectedOptions, onFilterChange, years } = this.props;
    const selectedYear = selectedOptions && selectedOptions.year;
    const initialYear = selectedYear && selectedYear;
    let currentYearIndex = 0;
    this.setState({ disablePlay: true });

    const playAtStart = setInterval(
      () => {
        if (years[currentYearIndex]) {
          onFilterChange({ sector: selectedOptions.sector, year: String(years[currentYearIndex]) });
        }
        if (currentYearIndex > years.length - 1) {
          clearInterval(playAtStart);
          setTimeout(
            () => {
              onFilterChange({ sector: selectedOptions.sector, year: String(initialYear) });
              this.setState({ disablePlay: false });
            },
            10000
          );
        }
        currentYearIndex += 1;
      },
      500
    );
  };
  /*renderDropdown = field => {
    const {
      options,
      activityOptions,
      selectedActivity,
      selectedOptions,
      activitySelectable,
      t
    } = this.props;
    const isActivityDropdown = field === 'activity';
    const dropdownOptions = isActivityDropdown
      ? activityOptions
      : options[field] || [];
    const value = isActivityDropdown
      ? selectedActivity
      : selectedOptions && selectedOptions[field];
    const label = t(
      `pages.national-context.sectoral-activity.labels.${kebabCase(field)}`
    );
    const disabled = isActivityDropdown && !activitySelectable;

    return (
      <Dropdown
        key={field}
        label={label}
        disabled={disabled}
        placeholder={`Filter by ${label}`}
        options={dropdownOptions}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
      />
    );
  };

  renderTimeline = () => {
    const { years, selectedOptions } = this.props;
    const { disablePlay } = this.state;
    const selectedYear = selectedOptions && selectedOptions.year;

    const yearsAsStrings = years.map(y => String(y));

    return (
      <div className={styles.timelineWrapper}>
        <PlayTimeline
          onPlay={this.handlePlay}
          years={yearsAsStrings}
          selectedYear={selectedYear && selectedYear.value}
          disablePlay={disablePlay}
        />
      </div>
    );
  };*/ /*<div className={styles.mapButton} onClick={() => console.log('asd')}>
          <div className={styles.sectorWrapper}>
            <p className={styles.buttonText}>
              Energy
            </p>
          </div>
          <div className={styles.buttonIconWrapper}>
            <p className={styles.buttonText}>
              2
            </p>
            <Icon icon={energy_color} style={{height: 35, width: 35}} />
          </div>
        </div>
        <div className={styles.mapButton} onClick={() => console.log('asd')}>
          <div className={styles.sectorWrapper}>
            <p className={styles.buttonText}>
              IPPU
            </p>
          </div>
          <div className={styles.buttonIconWrapper}>
            <p className={styles.buttonText}>
              3
            </p>
            <Icon icon={industry_color} style={{height: 35, width: 35}} />
          </div>
        </div>
        <div className={styles.mapButton} onClick={() => console.log('asd')}>
          <div className={styles.sectorWrapper}>
            <p className={styles.buttonText}>
              Agriculture
            </p>
          </div>
          <div className={styles.buttonIconWrapper}>
            <p className={styles.buttonText}>
              4
            </p>
            <Icon icon={agriculture_color} style={{height: 35, width: 35}} />
          </div>
        </div>
        <div className={styles.mapButton} onClick={() => console.log('asd')}>
          <div className={styles.sectorWrapper}>
            <p className={styles.buttonText}>
              Waste
            </p>
          </div>
          <div className={styles.buttonIconWrapper}>
            <p className={styles.buttonText}>
              5
            </p>
            <Icon icon={waste_color} style={{height: 35, width: 35}} />
          </div>
        </div>*/

  renderSectorSelector = () => {
    const { active } = this.state;
    const { sectors } = this.props;

    return (
      <div className={styles.mapButtonWrapper} style={{ zIndex: 2 }}>
        {sectors.map((sector, index) => {
          return (
            <div
              className={styles.mapButton}
              onClick={() => this.handleFilterChange('sector', sector.code)}
              key={index}
            >
              <div className={styles.sectorWrapper}>
                <p className={styles.buttonText}>
                  {sector.label}
                </p>
              </div>
              <div className={styles.buttonIconWrapper}>
                <p className={styles.buttonText}>
                  {index + 1}
                </p>
                {sector.code === 'ENERGY' && (<Icon icon={energy_color} style={{ height: 35, width: 35 }} />)}
                {sector.code === 'IPPU' && (<Icon icon={industry_color} style={{ height: 35, width: 35 }} />)}
                {sector.code === 'FORESTRY' && (<Icon icon={forestry_color} style={{ height: 35, width: 35 }} />)}
                {sector.code === 'WASTE' && (<Icon icon={waste_color} style={{ height: 35, width: 35 }} />)}
                {sector.code === 'AGRICULTURE' && (<Icon icon={agriculture_color} style={{ height: 35, width: 35 }} />)}
              </div>
            </div>
          );
        })}
        {}
      </div>
    );
  };

  renderSectorDescription = () => {
    const { active } = this.state;

    return (
      <div className={active ? styles.sectorDescriptionContainerActive: styles.sectorDescriptionContainer}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '50px',
            padding: '0 10px',
            borderBottom: '3px solid #000000'
          }}
        >
          <p>
            1 Forestry
          </p>
          <p onClick={() => this.setState({ active: !active })}>
            x
          </p>
        </div>
      </div>
    );
  };
  renderTimeline = () => {
    const { years, selectedOptions } = this.props;
    const { disablePlay } = this.state;
    let selectedYear = selectedOptions && selectedOptions.year;
    if(selectedYear === undefined) {
      selectedYear = 2000
    }

    const yearsAsStrings = years.map(y => String(y));

    return (
      <div className={styles.timelineWrapper}>
        <PlayTimeline
          onPlay={this.handlePlay}
          years={yearsAsStrings}
          selectedYear={selectedYear && selectedYear}
          disablePlay={disablePlay}
        />
      </div>
    );
  };

  render() {
    const {
      map,
      adaptationParams,
      emissionParams,
      years,
      mapLoading,
      // selectedOptions,
      // adaptationCode,
      // sources,
      t
    } = this.props;

    // const yearsSelectable = selectedOptions.indicator && selectedOptions.indicator.value !== adaptationCode;
    return (
      <div>
        <div className={styles.page}>
          <SectionTitle
            title={t('pages.emissions-portal.emission-map.title')}
          />
          <div className={styles.filtersGroup}>
            {}
          </div>
          <MetadataProvider meta="ghgindo" />
        </div>
        <div className={styles.mapSection}>
          {
            mapLoading && 
            <div className={styles.loadingOverlay}>
              <Loading />
            </div>
          }
          {this.renderSectorDescription()}
          {this.renderSectorSelector()}
          <div className={styles.mapContainer}>
            {
              map && (
                  <React.Fragment>
                    <Map
                      zoom={5}
                      paths={map.paths}
                      forceUpdate
                      center={MAP_CENTER}
                      className={styles.map}
                      tooltip={MapTooltip}
                    />
                    <div className={styles.legend}>
                      <DotLegend legend={map.legend} />
                    </div>
                    {this.renderTimeline()}
                  </React.Fragment>
                )
            }
          </div>
        </div>
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        {adaptationParams && <AdaptationProvider params={adaptationParams} />}
      </div>
    );
  }
}

EmissionMap.propTypes = {
  // map: PropTypes.shape({ paths: PropTypes.array, legend: PropTypes.array }),
  // years: PropTypes.array,
  // options: PropTypes.object,
  // selectedOptions: PropTypes.object,
  // onFilterChange: PropTypes.func.isRequired,
  // adaptationParams: PropTypes.object.isRequired,
  // adaptationCode: PropTypes.string.isRequired,
  // emissionParams: PropTypes.object,
  // activitySelectable: PropTypes.bool.isRequired,
  // activityOptions: PropTypes.array,
  // selectedActivity: PropTypes.object,
  // sources: PropTypes.array
  t: PropTypes.func.isRequired
};

EmissionMap.defaultProps = {
  map: {},
  options: {},
  years: [],
  selectedOptions: {},
  activityOptions: [],
  selectedActivity: {},
  sources: [],
  emissionParams: null
};

export default EmissionMap;