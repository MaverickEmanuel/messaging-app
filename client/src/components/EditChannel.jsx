import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { EditUserList, ViewUserList } from './';
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

const EditChannel = ({ setIsEditing }) => {
	const { client, channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([]);

	const updateChannel = async (event) => {
		event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);

        if(nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`});
        }

        if(selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);
	}

	const leaveChannel = async (event) => {
		event.preventDefault();

		await channel.removeMembers([client.userID]);
	}

	return (
		<div className='edit-channel__container'>
			<div className='edit-channel__header'>
				<p>Edit Channel</p>
				<CloseCreateChannel setIsEditing={setIsEditing} />
			</div>
			<ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
			<p className='edit-channel__label'>View Members</p>
			<ViewUserList setSelectedUsers={setSelectedUsers} />
			<p className='edit-channel__label'>Add Members</p>
			<EditUserList setSelectedUsers={setSelectedUsers} />
			<div className='edit-channel__button-wrapper'>
				<p className='edit-channel__button-leave' onClick={leaveChannel}>Leave Channel</p>
				<p className='edit-channel__button-update' onClick={updateChannel}>Save Changes</p>
			</div>
		</div>
	)
}

export default EditChannel