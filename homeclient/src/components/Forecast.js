import React, { Component } from 'react';
import moment from 'moment';

export class Forecast extends Component {
  static displayName = Forecast.name;
  static intervalId;

  constructor(props) {
    super(props);
    this.state = { forecast: [], loading: true };
  }

  componentDidMount() {
    this.populateForecastData();
    // Refresh data every 1 hour
    this.intervalId = setInterval(this.populateForecastData.bind(this), 10*1000);
    document.getElementById('root').scrollTop = 0 
  }

  componentWillUnmount() {
    // Stop refreshing
    clearInterval(this.intervalId);
  }

static renderRotate(degree) {
  return ({transform: 'rotate(' + degree + 'deg)'});
}

  static renderWeatherContents(forecastdata) {
    return (
      <div>        
        <table className="forecastTable">
          <tbody>
            {forecastdata.map(forecastitem =>
              <tr key={forecastitem.Datetime}>
                <td className="time-col">{moment(forecastitem.Datetime).format('HH:mm')}</td>
                <td><img alt="" width="55" height="55" src={"/img/" + forecastitem.WeatherSymbol3 + ".svg"} /></td>
                <td className="temperature-col">{Math.round(forecastitem.Temperature)}°</td>
                <td><div className="wind-container"><img alt="" style={Forecast.renderRotate(forecastitem.WindDirection-180)} src="/img/arrow.svg" width="40px" height="40px" /><span className="wind-text">{Math.round(forecastitem.WindSpeedMS)}</span></div></td>
                <td><div className="rainBox" style={{width: forecastitem.Precipitation1h*10 + 'px'}}></div></td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Forecast.renderWeatherContents(this.state.forecastdata);

    return (
      <div id='forecast' className='box'>
        <h2>Forecast 24h</h2>
        <h3>Tapanila, Helsinki</h3>
         {contents}
      </div>
    );
  }

  async populateForecastData() {
    const response = await fetch('http://raspberrypi.local:5000/weatherfore');
    const data = await response.json();
    this.setState({ forecastdata: data, loading: false });
  }
}
