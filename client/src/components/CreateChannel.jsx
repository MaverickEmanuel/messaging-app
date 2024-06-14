import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { EditUserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
	const handleChange = (event) => {
		event.preventDefault();

		setChannelName(event.target.value);
	}

	return (
		<div className='channel-name-input__wrapper'>
			<p>Name</p>
			<input value={channelName} onChange={handleChange} placeholder='channel-name (no spaces)' />
		</div>
	)
}

const CreateChannel = ({ createType, setIsCreating }) => {
	const { client, setActiveChannel } = useChatContext();
	const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
	const [channelName, setChannelName] = useState('');

	const createChannel = async (e) => {
		e.preventDefault();

		try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName, members: selectedUsers
            });

            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);
        } catch (error) {
            console.log(error);
        }
	}

  	return (
		<div className='create-channel__container'>
	  		<div className='create-channel__header'>
				<p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
				<CloseCreateChannel setIsCreating={setIsCreating} />
			</div>
			{createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
			<p className='channel-name-input__label'>Add Members</p>
			<EditUserList setSelectedUsers={setSelectedUsers} createType={createType} />
			{createType === 'team' ? 
				channelName === '' ? <div className='create-channel__button-wrapper__inactive'>
					<p>Create Channel</p>
				</div> : (
				<div className='create-channel__button-wrapper' onClick={createChannel}>
					<p>Create Channel</p>
				</div>
				) : 
				selectedUsers.length === 1 ? <div className='create-channel__button-wrapper__inactive'>
					<p>Create Message Group</p>
				</div> : (
				<div className='create-channel__button-wrapper'>
					<p>Create Message Group</p>
				</div>
				)
			}
		</div>
  	)
}

export default CreateChannel