import React, { Component } from 'react';
import { Forecast } from './Forecast';
import { WeatherData } from './WeatherData';
import { WeatherNow} from './WeatherNow'
import { Indoor} from './Indoor'
import { Time } from './Time'
import { FamilyCalendar} from './FamilyCalendar'

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div id="home" className="container-fluid">
        <div className="row header box">
          <div className="col-sm-2"><WeatherNow /></div>
          <div className="col-sm-4"><Indoor /></div>
          <div className="d-none d-sm-block col-sm-3 timeBox offset-md-3"><Time /></div>
        </div>
        <div className="row">
          <div className="col-sm-5"><Forecast /></div>
          <div className="col-sm-7"><FamilyCalendar /></div>
        </div>
        <div className="row">
          <div className="col-sm-12"><WeatherData /></div>
        </div>
      </div>
    );
  }
}
