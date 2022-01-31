import React, { Component } from 'react';

export class WeatherNow extends Component {
  static displayName = WeatherNow.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { weatherdata: this.props.weatherdata, loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
    // Refresh data every 1 hour
    this.intervalId = setInterval(this.populateWeatherData.bind(this), 60*60*1000);
  }
  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

  async populateWeatherData() {
    const response = await fetch('/weathernow');
    const data = await response.json();
    this.setState({ weatherdata: data, loading: false });
  }


  render() {
    let contents = this.state.loading
      ? <div><p className="temperatureNow"><em>...</em></p></div>
      : <div>
          <p className="temperatureNow">{this.state.weatherdata[this.state.weatherdata.length-1].temperature }°</p>
        </div>

    return (
      <div id="weatherNow">
         {contents}
      </div>
    );
  }

}
