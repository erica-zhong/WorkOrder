import React from 'react';
import '../App.css';
import axios from 'axios';
import {Line, Bar } from 'react-chartjs-2';

class Metrics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartLabels: [],
            barChartValues: [],
            lineChartDataSets: [],
            facilityCountsLabels: [],
            facilityCountsValues: []
        }
    }

    componentWillMount() {

        function random_rgba() {
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        }

        axios.get('http://localhost:8000/workers')
            .then(res => {
                // build the array for the bar chart data
                var barChartLabels = []
                var barChartValues = []
                for (let worker of res.data) {
                    barChartLabels.push(worker.name)
                    barChartValues.push(worker.queue.length)
                }
                this.setState({barChartLabels, barChartValues})
            })
            .catch(function(error) {
                console.log(error)
            })

        axios.get('http://localhost:8000/workorders')
            .then(res => {
                // build the array for the line chart data
                var equipmentDict = {};
                // get a count of work orders per facility
                var facility_counts = {};
                for (let workorder of res.data) {
                    var d = new Date(workorder.createdAt);
                    var hour = d.getHours();

                    var timeStamp = Math.round(new Date().getTime() / 1000);
                    var timeStampYesterday = timeStamp - (24 * 3600);

                    var equipment_type = workorder.equipment_type;
                    if (equipment_type in facility_counts) {
                        facility_counts[equipment_type] += 1
                    } else {
                        facility_counts[equipment_type] = 1
                    }
                    
                    // only consider work orders for the past 24 hours
                    if (d >= new Date(timeStampYesterday*1000).getTime()) {
                        // create a mapping of equipment types to frequency of use per hour
                        // for the past 24 hours
                        if (workorder.equipment_type in equipmentDict) {
                            if (hour in equipmentDict[workorder.equipment_type]) {
                                equipmentDict[workorder.equipment_type][hour] += 1
                            } else {
                                equipmentDict[workorder.equipment_type][hour] = 1
                            }
                        } else {
                            var new_dict = {}
                            new_dict[hour] = 1
                            equipmentDict[workorder.equipment_type] = new_dict
                        }
                    }
                }
                var lineChartDataSets = []
                for (const [key, value] of Object.entries(equipmentDict)) {
                    var dataSet = {
                        label:key,
                        data:[],
                        borderColor: random_rgba()
                    }
                    for (var i = 1; i < 25; i++) {
                        if (i in value) {
                            dataSet.data.push(value[i]);
                        } else {
                            dataSet.data.push(0);
                        }
                    }
                    lineChartDataSets.push(dataSet);
                }
                
                var facilityCountsLabels = []
                var facilityCountsValues = []
                for (const [key, value] of Object.entries(facility_counts)) {
                    facilityCountsLabels.push(key);
                    facilityCountsValues.push(value);
                }
                this.setState({lineChartDataSets, facilityCountsLabels, facilityCountsValues})

            })
            .catch(function(error) {
                console.log(error)
            })
    }

    render() {

        function random_rgba() {
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        }
        
        var barChartColor = random_rgba();
        var barChartData = {
            labels: this.state.barChartLabels,
            datasets: [{
                label: "Queue Length per Technician",
                backgroundColor: barChartColor,
                borderColor: barChartColor,
                data: this.state.barChartValues
            }]
        }

        var arr = []
        var curr = new Date().getHours();

        for (var i = 0; i < 24; i++) {
            curr = curr == 0 ? 24 : curr
            arr.unshift(curr)
            curr = curr -1 == 0 ? 24 : curr - 1 
        }

        var lineChartData = {
            labels: arr,
            datasets: this.state.lineChartDataSets
        }

        var barStyle = {
            width: 800
        }

        var facilityColor = random_rgba();

        var facilityCountsData = {
            labels: this.state.facilityCountsLabels,
            datasets: [{
                label: "Number of Work Orders per Facility",
                backgroundColor: facilityColor,
                borderColor: facilityColor,
                data: this.state.barChartValues
            }]
        }

        return (
            <div>
                <div style={barStyle}>
                    <h2>Hourly Frequency of Work Order per Equipment Type</h2>
                    <Line data={lineChartData}/>
                </div>

                <div style={barStyle}>
                    <h2>Queue Length per Technician</h2>
                    <Bar data={barChartData}/>
                </div>

                <div style={barStyle}>
                    <h2>Number of Work Orders per Facility</h2>
                    <Bar data={facilityCountsData}/>
                </div>            
            </div>
        );
    }
}
export default Metrics;