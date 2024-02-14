import React, { useEffect, useState } from 'react';
import cls from './SideMenu.module.css';
import { getPointData } from "../services/RecordsService.js";

const SideMenu = ({ dotInfo }) => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            let result = {};
            if (dotInfo.values_) {
                result = await getPointData(dotInfo.values_.record_id);
            } else if (dotInfo.properties) {
                result = await getPointData(dotInfo.properties.record_id);
            }
            setInfo(result);
        };
        fetchData();
    }, [dotInfo]);

    return (
        <div className={cls.sideMenuContainer} >
            {info.title ? (
                <>
                    <div style={{ height: '50vh', width: '42.5vw', right: 0}}>
                        <img src={info.image_url} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: '90%', display: 'block', margin: '5% auto' }} />
                    </div>
                    <div style={{ width: '42.5vw', height: '50vh', overflow: 'hidden' }}>
                        <h1 style={{ margin: '2% 0 2% 15%',  position: 'sticky', top: 0, backgroundColor: 'inherit', textAlign: 'left' }}>{info.title}</h1>
                        <h2 style={{ margin: '-2% 0 2% 15%', position: 'sticky', top: 0, backgroundColor: 'inherit', textAlign: 'left', fontWeight: 500 }}>{info.subtitle || "Subtitle"}</h2>
                        <div style={{ height: 'calc(35vh)', overflowY: 'scroll', padding: '0 15%' }}>
                            <p style={{ textAlign: 'start' }}>
                                {info.body}
                                Lorem ipsum purus in mollis nunc sed id semper. Suspendisse faucibus interdum posuere lorem ipsum. Dictum non consectetur a erat. Risus nullam eget felis eget nunc lobortis mattis aliquam faucibus. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. Faucibus et molestie ac feugiat sed lectus vestibulum mattis. In nibh mauris cursus mattis molestie a iaculis at erat. Velit aliquet sagittis id consectetur purus ut faucibus. Lorem dolor sed viverra ipsum. Facilisis gravida neque convallis a cras. Adipiscing vitae proin sagittis nisl rhoncus. Odio eu feugiat pretium nibh ipsum. Sit amet nulla facilisi morbi. Viverra mauris in aliquam sem. Vitae justo eget magna fermentum. Ultrices dui sapien eget mi proin sed libero. Convallis a cras semper auctor neque vitae tempus quam. Netus et malesuada fames ac turpis egestas. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Suspendisse potenti nullam ac tortor vitae.
                                Blandit volutpat maecenas volutpat blandit. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquet enim tortor at auctor urna nunc id cursus metus. Phasellus faucibus scelerisque eleifend donec pretium vulputate. Enim ut tellus elementum sagittis vitae et leo. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Elementum integer enim neque volutpat ac tincidunt vitae. Id leo in vitae turpis massa sed elementum. Volutpat sed cras ornare arcu dui vivamus arcu felis. Suspendisse in est ante in. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Elit eget gravida cum sociis natoque. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut. Purus faucibus ornare suspendisse sed. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh. Ac turpis egestas integer eget aliquet.
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <p>{JSON.stringify(dotInfo)}</p>
            )}
        </div>
    );
};

export default SideMenu;
