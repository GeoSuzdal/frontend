import React, {useEffect, useState} from 'react';
import cls from './SideMenu.module.css'
import {getPointData} from "../services/RecordsService.js";

const screenWidth = window.innerWidth * 0.01
const screenHeight = window.innerHeight * 0.01

const SideMenu = ({dotInfo}) => {
    const [info, setInfo] = useState({})

    useEffect(() => {
        console.log(dotInfo)
        const fetchData = async () => {
            let result = {}
            if (dotInfo.values_) {
                result = await getPointData(dotInfo.values_.record_id)
            } else if (dotInfo.properties) {
                result = await getPointData(dotInfo.properties.record_id)
            }
            setInfo(result)
        }
        fetchData()
    }, [dotInfo]);


    return (
        <div className={cls.sideMenuContainer}>
            {info.title ?
                <>
                    <div style={{ height: `${screenHeight*(100/7)*4}px`, position: "absolute", left: 0, }}>
                        <img src={info.image_url} style={{width: "50%", height: "auto", marginTop: "3%"}}/>
                    </div>
                    <div style={{width: "45vw", height: `${screenHeight*(100/7)*3}px`, position: "absolute", left: 0, bottom: 0, overflow: "scroll"}}>
                        <h1 style={{margin: "5% 0 2% 0"}}>{info.title}</h1>
                        <p>{info.body}</p>
                        <p style={{textAlign: "start", margin: "0% 15%", marginBottom: "5%"}}>
                            Что такое Lorem Ipsum?
                            Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.

                            Почему он используется?
                            Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).
                        </p>
                    </div>
                </>
                : <p>{JSON.stringify(dotInfo)}</p>
            }
        </div>
    );
};

export default SideMenu;