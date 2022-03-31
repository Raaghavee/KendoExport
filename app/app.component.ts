import { Component, OnInit } from '@angular/core';
import { userDetails, months } from './EmployeeDetails';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  public months = months;
  public userSeatMapping = userDetails;

  roster: any[] = [];
  monthlyData: any[] = [];
  list = '9:00,10:00,11:00';
  options = {
    background: '#666',
    color: '#fff',
    validation: {
      dataType: 'list',
      showButton: true,
      comparerType: 'list',
      from: '"9:00,10:00,11:00"',
      allowNulls: true,
      type: 'reject',
    },
  };

  ngOnInit() {
    let uniqueNames = new Set(
      this.userSeatMapping.map((user) => user.enterpriseId)
    );

    let uniqueNameArr = [...uniqueNames].map((usr) => {
      return {
        enterpriseId: usr,
      };
    });
    this.roster = this.getMonthlyView(2022, 3, uniqueNameArr);
  }

  getMonthlyView(year, month, uniqueNameArr) {
    let daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      let dateVal = new Date(year, month - 1, i, 0, 0, 0).toLocaleDateString();

      let str = this.getFormattedDate(dateVal);
      let dateArrayVal = {
        date: str,
        field: 'duration' + str,
        col: 'startTime' + str,
        isweekend: this.isWeekendDate(dateVal),
      };
      if (!this.monthlyData.find((dt) => dt.date === str)) {
        this.monthlyData.push(dateArrayVal);
      }
      let dateDetail = {};
      dateDetail['date' + str] = dateVal;

      dateDetail['duration' + str] = '';
      dateDetail['startTime' + str] = '';
      uniqueNameArr = uniqueNameArr.map((name) => {
        let modifieddateDetail = JSON.parse(JSON.stringify(dateDetail));
        let userDetail = this.userSeatMapping.find(
          (usr) =>
            usr.enterpriseId == name.enterpriseId &&
            new Date(usr.date).toLocaleDateString() === dateVal
        );
        if (userDetail != null && userDetail != undefined) {
          modifieddateDetail['duration' + str] = userDetail.duration;
          modifieddateDetail['startTime' + str] = userDetail.startTime;
        }
        return {
          ...name,
          ...modifieddateDetail,
        };
      });
    }
    return uniqueNameArr;
  }

  getFormattedDate(dateVal) {
    let dateObj = new Date(dateVal);
    return (
      dateObj.getDate() +
      '-' +
      months[dateObj.getMonth()] +
      '-' +
      dateObj.getFullYear()
    );
  }

  isWeekendDate(dateVal) {
    let dateObj = new Date(dateVal);
    return dateObj.getDay() === 0 || dateObj.getDay() === 6;
  }
}
