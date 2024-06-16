import React, { useState, useEffect } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';

import { ChannelInfo } from '../assets';
import SidebarIcon from '../assets/sidebar.png';

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing, toggleSidebar, setToggleSidebar }) => {
	const [giphyState, setGiphyState] = useState(false);
	const { sendMessage } = useChannelActionContext();
	
	const overrideSubmitHandler = (message) => {
		let updatedMessage = {
			attachments: message.attachments,
			mentioned_users: message.mentioned_users,
			parent_id: message.parent?.id,
			parent: message.parent,
			text: message.text,
		};
		
		if (giphyState) {
			updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
		};
		
		if (sendMessage) {
			sendMessage(updatedMessage);
			setGiphyState(false);
		};
	};

	return (
		<GiphyContext.Provider value={{ giphyState, setGiphyState }}>
			<div style={{ display: 'flex', width: '100%', height: '100%' }}>
				<Window>
					<TeamChannelHeader 
						setIsEditing={setIsEditing} 
						toggleSidebar={toggleSidebar}
                    	setToggleSidebar={setToggleSidebar}
					/>
					<MessageList />
					<MessageInput overrideSubmitHandler={overrideSubmitHandler} />
				</Window>
				<Thread />
			</div>
		</GiphyContext.Provider>
	);
};

const TeamChannelHeader = ({ setIsEditing, setToggleSidebar }) => {
	const { channel, watcher_count } = useChannelStateContext();
	const { client } = useChatContext();
	const [width, setWidth] = useState(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange);
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		}
	}, []);

	const useToggleSidebar = width <= 960;

	console.log(width);

	const MessagingHeader = () => {
		const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
		const additionalMembers = members.length - 3;

		if(channel.type === 'messaging') {
			return (
				<div className='team-channel-header__name-wrapper'>
					{useToggleSidebar && 
						<div className='team-channel-header__open-sidebar' onClick={() => setToggleSidebar((prevToggleContainer) => !prevToggleContainer)}>
							<img src={SidebarIcon} alt='Open Sidebar' width='30' />
						</div>
					}
					{members.map(({ user }, i) => (
						<div key={i} className='team-channel-header__name-multi'>
							<Avatar image={user.image} name={user.fullName || user.id} size={32} />
							<p className='team-channel-header__name user'>{user.fullName || user.id}</p>
						</div>
					))}

					{additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
				</div>
			);
		};

		return (
			<div className='team-channel-header__channel-wrapper'>
				{useToggleSidebar && 
					<div className='team-channel-header__open-sidebar' onClick={() => setToggleSidebar((prevToggleContainer) => !prevToggleContainer)}>
						<img src={SidebarIcon} alt='Open Sidebar' width='30' />
					</div>
				}
				<p className='team-channel-header__name'># {channel.data.name}</p>
				<span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
					<ChannelInfo />
				</span>
			</div>
		);
	};

	const getWatcherText = (watchers) => {
		if (!watchers) return 'No users online';
		if (watchers === 1) return '1 user online';
		return `${watchers} users online`;
	};

	return (
		<div className='team-channel-header__container'>
			<MessagingHeader />
			<div className='team-channel-header__right'>
				<p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
			</div>
		</div>
	);
};

export default ChannelInner;