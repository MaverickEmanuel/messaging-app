import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth } from './components';

import 'stream-chat-react/dist/css/v2/index.css';
import './App.css';

const cookies = new Cookies();

const apiKey = '63e44zr3mumz';
const authToken = cookies.get('token');

const client = StreamChat.getInstance(apiKey);

if(authToken) {
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
        email: cookies.get('email'),
    }, authToken);
};

const App = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    if(!authToken) return <Auth />

    return (
        <div className='app__wrapper'>
            <Chat client={client} theme='team light'>
                <ChannelListContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    toggleSidebar={toggleSidebar}
                    setToggleSidebar={setToggleSidebar}
                />
                <ChannelContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
                    setToggleSidebar={setToggleSidebar}
                />
            </Chat>
        </div>
    );
}

export default App