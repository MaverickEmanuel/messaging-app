import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const ListContainer = ({ children }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user }) => {
    return (
        <div className='user-item__wrapper'>
            <div className='user-item__name-wrapper'>
                <Avatar image={user.image} name={user.fullName || user.name || user.id} size={32} />
                <p className='user-item__name'>{user.fullName || user.name || user.id}</p>
            </div>
        </div>
    )
}

const ViewUserList = () => {
    const { client, channel } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    const channelMembers = useMemo(() => channel?.state.members
        ? Object.keys(channel.state.members)
        : [],
        [channel?.state?.members],
    );

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);
            
            try {
                const response = await client.queryUsers(
                    { $and: [ { id: { $ne: client.userID } }, { id: { $in: channelMembers } } ] },
                    { id: 1 },
                    { limit: 8 } 
                );

                if(response.users.length) {
                    setUsers(response.users);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
               setError(true);
               console.log(error);
            }

            setLoading(false);
        }

        if(client) getUsers()
    }, [client, channelMembers]);

    if(error) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    No users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className='user-list__message'>
                Loading users...
            </div> : (
                users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user} />
                ))
            )}
        </ListContainer>
    )
}

export default ViewUserList