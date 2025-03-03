import '../chatPage.css'
import React,{useContext} from 'react';
import { userInfoContext } from '../chatPage';

export const VerticalNavBar = (props) =>{
    const userInfo = useContext(userInfoContext)
    return(
        <div className='VerticalNavBar'>
            <Box icon={"./chat2.png"} title = 'chats' handleClick={props.handleClick}></Box>
            <Box icon={'/notifications.jpeg'} title='notifications' handleClick= {props.handleClick}></Box>
            <Box icon={'/add2.jpeg'} title='newChat' handleClick= {props.handleClick}></Box>
            <Box icon={userInfo.profilePic} title='profile' handleClick= {props.handleClick}></Box>
        </div>
    )
}

export const Box = (props) => {
    const style = props.title === 'profile' ? { marginTop: 'auto' } : {};

    return (
        <div className='Box' style={style} onClick={() => props.handleClick(props.title)}>
            <img
                className='boxIcon'
                src={props.icon}
                alt={props.title}
            />
        </div>
    );
};
