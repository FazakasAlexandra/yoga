import Image from 'next/image'
import { useEffect, useState } from 'react';
import ClassDialog from './ClassDialog';
import DayScheduleClassForm from './DayScheduleClassForm';
import { useSession } from 'next-auth/client'
import db from '../db.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function DayScheduleCard({ dayData, changeDayData, dayNumber }) {
    const [open, setOpen] = useState(false);
    const [yogaClass, setYogaClass] = useState(dayData);
    const [daySchedule, setDaySchedule] = useState(dayData.schedule)
    const addNewClass = () => {
        console.log(daySchedule)
        const newClass = {
            classDescription: "",
            classLevel: "",
            className: "",
            classType: "",
            hour: "",
            id: daySchedule.length,
            offlinePrice: "0",
            onlinePrice: "0",
            schedulesWeeksId: "1",
            newClass: true
        }
        setDaySchedule([...daySchedule, newClass])
    }

    const removeClass = (removedClass) => {
        const newDaySchedule = daySchedule.filter((yogaClassItem) => yogaClassItem.id !== removedClass.id)
        setDaySchedule(newDaySchedule);
        setYogaClass({...yogaClass, schedule: newDaySchedule});
    }

    useEffect(()=>{
        console.log(daySchedule)
    }, [daySchedule])

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleInfoIconClick = (yogaClass) => {
        setOpen(true);
        setYogaClass(yogaClass)
        console.log(yogaClass)
    }

    const getSchedule = () => {
        console.log('getting schedule', daySchedule)
        return daySchedule.map((yogaClass, idx) => {
            yogaClass.id = idx
            return (
                <DayScheduleClassForm
                    key={idx}
                    dayScheduleClass={yogaClass}
                    handleInfoIconClick={handleInfoIconClick}
                    removeClass={removeClass}
                />
            )
        })
    }

    return (
        <div className="day-schedule card">
            <div className="head">
                <img src={`/assets/lotus.svg`} alt="lotus flower" />
                <h3>{dayData.day}</h3>
                <span>{dayData.date}</span>
                <button className="button-white" style={{ alignSelf: "baseline" }} onClick={() => addNewClass()}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        size="lg"
                        className="info-icon"
                    />
                </button>
            </div>

            <hr />

            {
                <div className="schedule">
                    {getSchedule()}
                </div>
            }
            {open ?
                <ClassDialog
                    isOpen={open}
                    title={yogaClass.className}
                    yogaClass={yogaClass}
                    content={
                        <>
                            <p><b>Class level</b></p>
                            <p>{yogaClass.classLevel}</p>
                            <p><b>Description</b></p>
                            <p>{yogaClass.classDescription}</p>
                        </>
                    }
                    closeDialog={handleDialogClose}
                    editMode={true}
                />
                : null}
        </div>
    )
}
