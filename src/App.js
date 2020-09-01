import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaugh,
  faSmile,
  faMeh,
  faFrown,
  faSadTear,
  faRandom,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "Octomber",
  "November",
  "December"
];
const moodsArr = [
  {
    icon: faLaugh,
    iconName: "laugh",
    moodColor: "#2d6b5f"
  },
  {
    icon: faSmile,
    iconName: "smile",
    moodColor: "#72e3a6"
  },
  {
    icon: faMeh,
    iconName: "meh",
    moodColor: "#dff4c7"
  },
  {
    icon: faFrown,
    iconName: "frown",
    moodColor: "#edbf98"
  },
  {
    icon: faSadTear,
    iconName: "sad",
    moodColor: "#ea3d36"
  }
];

const MoodComponent = (props) => {
  const { moodColor, icon, iconName, active, setMood } = props;

  return (
    <button
      className={active === true ? "mood selected" : "mood"}
      style={{ color: `${moodColor}` }}
      onClick={() => setMood(iconName)}
    >
      <FontAwesomeIcon className="icon" icon={icon} />
    </button>
  );
};

export default function App() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState(currentYear);

  const [currentMood, setCurrentMood] = useState(null);
  const [dates, setDates] = useState([]);

  const changeYear = (e) => {
    setYear(e.target.value);
  };

  const reset = () => {
    setCurrentMood(null);
    setDates(
      dates.map((d) => {
        d.mood = null;
        return d;
      })
    );
  };

  const randomize = () => {
    setCurrentMood(null);
    setDates(
      dates.map((d) => {
        d.mood = moodsArr[Math.floor(Math.random() * 5)].iconName;
        return d;
      })
    );
  };

  const changeMood = (date) => {
    setDates(
      dates.map((d) => {
        if (d.date === date) {
          d.mood = currentMood;
        }
        return d;
      })
    );
  };

  useEffect(() => {
    const startDate = new Date(`January 1 ${year}`);
    const endDate = new Date(`December 31 ${year}`);
    let currentDate = startDate;
    let datesArr = [{ date: currentDate, mood: null }];
    while (currentDate < endDate) {
      let newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      datesArr.push({ date: newDate, mood: null });
      currentDate = newDate;
    }
    setDates(datesArr);
  }, [year]);

  return (
    <div className="container">
      <h2>{year} Mood Calendar</h2>
      <h4>~ color each day depending on what your mood was / is ~</h4>
      <select value={year} onChange={changeYear}>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
      <p>Select mood:</p>
      <div className="moods_container">
        {moodsArr.map((mood) => (
          <MoodComponent
            active={mood.iconName === currentMood}
            currentMood={currentMood}
            setMood={setCurrentMood}
            key={mood.moodColor}
            {...mood}
          />
        ))}
      </div>
      <p>then click on the circles below</p>
      <button className="action_btn randomize" onClick={randomize}>
        <FontAwesomeIcon icon={faRandom} />
      </button>
      <button className="action_btn clear" onClick={reset}>
        <FontAwesomeIcon icon={faSync} />
      </button>
      <div className="calendar">
        {months.map((month) => (
          <Month
            key={month}
            year={year}
            month={month}
            dates={dates}
            changeMood={changeMood}
          />
        ))}
      </div>
    </div>
  );
}

const Month = (props) => {
  const { year, month, dates, changeMood } = props;

  const monthStart = new Date(`${month} 1 ${year}`);

  let nextMonthStart = new Date(monthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  const currentMonthDates = dates.filter(
    (d) => d.date >= monthStart && d.date < nextMonthStart
  );

  const startDay = monthStart.getDay();

  return (
    <div className="months">
      <h3>{month}</h3>
      <div className="week_days_container">
        <Week weekDays={weekDays} />
      </div>
      <div className="days_container">
        <Empty startDay={startDay} />
        <Day currentMonthDates={currentMonthDates} changeMood={changeMood} />
      </div>
    </div>
  );
};

const Week = (props) => {
  const { weekDays } = props;

  return weekDays.map((day) => (
    <div className="week_days" key={day}>
      {day}
    </div>
  ));
};

const Empty = (props) => {
  const { startDay } = props;

  let emptySlots = [];

  for (var i = 0; i < startDay; i++) {
    emptySlots.push(<div className="days" key={i} />);
  }

  return emptySlots;
};

const Day = (props) => {
  const { currentMonthDates, changeMood } = props;

  return currentMonthDates.map((cd) => {
    let backgroundColor = "#888";
    if (cd.mood) {
      const currentMood = moodsArr.filter((m) => m.iconName === cd.mood);
      backgroundColor = currentMood[0].moodColor;
    }
    return (
      <div className="days" key={cd.date} onClick={() => changeMood(cd.date)}>
        <span className="circle" style={{ backgroundColor: backgroundColor }}>
          {cd.date.getDate()}
        </span>
      </div>
    );
  });
};
