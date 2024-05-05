import { IoCloseSharp } from "react-icons/io5";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { apiGetGroupInfo, apiGetListChat } from '../services/group';
import * as actions from '../store/actions'
const socket = io('ws://127.0.0.1:5000');

const ChatForm = () => {
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  const { userGroup, groupInfo } = useSelector(state => state.app)  
  const { currentData } = useSelector(state => state.user)  
  const [isFetching, setIsFetching] = useState(false); // Thêm trạng thái để theo dõi trạng thái đang tải
  const dispatch = useDispatch()
  const [skip, setSkip] = useState(0); // Thêm skip vào trạng thái
  useEffect(() => {
    socket.on('recMessage', (msg) => {
      setMessageList((prevMessages) => [msg, ...prevMessages]);
    });

    return () => {
      socket.off('groupMessage');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if(message && message.length > 0 ) {
      if (message.trim() !== '') {
        socket.emit('recMessage', {  message, groupId: groupInfo.id, userId: currentData.id});
        setMessage('');
      }
    }
  }
  const getGroupInfo = async () => {
    if(groupInfo.id) {
      const res = await apiGetListChat({groupId: groupInfo.id, limit: 10, skip})
      const data = res.data
      setMessageList(pre => [...pre, ...data.data])
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.chat-container');
      if (element.scrollTop === 0) {
        // Kiểm tra xem có đang tải tin nhắn hay không trước khi tải thêm
        if (!isFetching) {
          setIsFetching(true); // Đánh dấu đang tải tin nhắn
          const setTimeOutid = setTimeout(() => {
            setSkip(prevSkip => prevSkip + 10); // Cập nhật skip khi cuộn lên
            setIsFetching(false); // Đánh dấu đã tải xong
            return setTimeOutid && clearTimeout(setTimeOutid)
          }, 300); // Chờ 3 giây trước khi tải thêm tin nhắn
        }
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching]);


  useEffect(() => {
    getGroupInfo()

    return () => {
      
    }
  }, [groupInfo.id, skip])
  

  useEffect(() => {
    // Ghi lại kết nối của người dùng vào nhóm
    socket.emit("joinGroup", groupInfo.id);
    
    // Ngắn người dùng khỏi nhóm khi họ rời khỏi trang hoặc thoát ứng dụng
    return () => {
      socket.emit("leaveGroup", groupInfo.id); // Gửi sự kiện tùy chỉnh "leaveGroup"
    };
  }, [groupInfo.id]); 
  return (
    <div className={`fixed z-[10000] chat-container flex flex-col right-0 bottom-0 w-[300px] h-[450px] border-[1px] border-gray-500 rounded-md bg-white`}>
        <div className='flex justify-between px-4 py-2'>
          <p>Chat với {groupInfo.name.replace(currentData.name, "")}</p> 
          <span className='cursor-pointer' onClick={() => {
            dispatch(actions.showChat(false))
          }}><IoCloseSharp className='cursor-pointer text-2xl'/></span>
        </div>
        <div className='bg-gray-500 h-[0.5px] w-full'></div>
        <div className='flex-1 px-2 py-4 flex gap-4 overflow-y-scroll flex-col-reverse'>
          {
            messageList.map(item => (
              <div className={`flex-col gap-2 items-center ${item.userId == currentData.id ? 'self-end' : ''}`}>
                <p className='text-xs'>{item.userId == currentData.id ? currentData.name : userGroup.find(item => item.id != currentData.id).name}</p>
                <div className={` gap-2 items-center ${item.userId == currentData.id ? 'flex-row-reverse flex' : 'flex'}`}>
                  <img src={item.userId == currentData.id ? currentData.avatar : userGroup.find(item => item.id != currentData.id).avatar} className='w-8 h-8' alt="" />
                  <p className=''>{item.message}</p>
                </div> 
              </div>              
            ))
          }
        </div>
        <div className='bg-gray-500 h-[0.5px] w-full'></div>
        <form action="" onSubmit={handleSubmit} className='flex my-2 px-2 gap-4'>
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} className='rounded-full flex-1 py-2 px-4 border-gray-500 outline-blue-300 border-[0.5px]'/>
          <button type='submit' className='py-2 px-4 bg-blue-500 hover:bg-blue-400 text-white rounded-md'>Gửi</button>
        </form>
    </div>
  )
}

export default ChatForm 