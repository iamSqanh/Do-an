import React from 'react'
import { useState } from 'react';
import { AiTwotoneMessage } from "react-icons/ai";
import { apiGetGroupList, apiGetUserGroup } from '../services/group';
import { useEffect } from 'react';
import * as actions from '../store/actions'
import { useDispatch, useSelector } from 'react-redux';
import { IoCloseSharp } from "react-icons/io5";

const ChatList = () => {
  const [isShowListChat, setIsShowListChat] = useState(false)
  const { currentData } = useSelector(state => state.user)  
  const [groupList, setGroupList] = useState([])
  const dispatch = useDispatch()
  const handleGetGroupList = async () => {
    if(currentData.id) {
        const res = await apiGetGroupList(currentData.id)
        const data = res.data
        setGroupList(data)
    }
  }

  const handleOpenChat = async (el) => {
    if(el) {
        const res = await apiGetUserGroup(el.id)
        const listUser = res.data
        const userChat = listUser.find(el => el.id != currentData.id)
        setIsShowListChat(false)
        dispatch(actions.showChat(true))
        dispatch(actions.getUserGroup([{userId: userChat.id, avatar: userChat.avatar, name: userChat.name}, {userId: currentData.id, avatar: currentData.avatar, name: currentData.name}]))
        dispatch(actions.getGroupInfo(el))
    }
  }
  
    return (
    <div className='fixed bottom-10 right-10 flex flex-col'>
        {isShowListChat && <div className='w-[300px] py-4 pl-4 pr-1 h-[600px]  bg-white rounded-md'>
            <h2 className='mb-4 flex justify-between  items-center'>Danh sách chat trước đó <IoCloseSharp className='cursor-pointer text-2xl' onClick={() => setIsShowListChat(false)} /></h2>
            <ul className='flex flex-col gap-1 overflow-y-scroll h-[520px]'>
                {
                    groupList.map(el => (
                        <li onClick={() => handleOpenChat(el)} className='cursor-pointer hover:bg-gray-400 py-4 rounded-md px-4'>
                            Chat với {el.name.replace(currentData.name, "")}
                        </li>
                    ))
                }
            </ul>
        </div>}
        <div className='cursor-pointer self-end' onClick={() => {
            setIsShowListChat(pre => !pre)
            handleGetGroupList()
        }}>
            <AiTwotoneMessage className='color-blue text-6xl' color='blue'/>
        </div>
    </div>
  )
}

export default ChatList