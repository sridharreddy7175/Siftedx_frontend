import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { UsersListItem } from '../../../app/model/users/users-list';
import { UsersService } from '../../../app/service/users.service';
import { AppLoader } from '../../../components/loader';
import TeamMember from '../../../components/team-membe';

export const DeactivatedMembers = () => {
    const [allMembers, setAllMembers] = useState<UsersListItem[] | []>([]);
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDeactivatedMembers('');
    }, []);

    const getDeactivatedMembers = (search: any) => {
        setLoading(true);
        UsersService.getDeactivatedUsers(companyUuid, search).then(res => {
            if (res?.error) {
                toast.error(res?.error?.message);
                setLoading(false);
            } else {
                setAllMembers([...res]);
                setLoading(false);
            }
        });
    }

    const onActions = (data: any) => {
        if (data.type === 'delete') {
            setLoading(true);
            data.data.map((data: any, index: number) => {
                UsersService.deleteUser(data.uuid).then(res => {
                    if (res.error) {
                        toast.error(res?.error?.message);
                        setLoading(false);
                    } else {
                        getDeactivatedMembers('');
                        setLoading(false);
                    }
                });
            })
        } else if (data.type === 'makeAdmin' || data.type === 'makeHrManager') {
            setLoading(true);
            const updateData = {
                user_uuid: data.data[0]?.uuid,
                role_uuid: data?.role?.uuid
            }
            UsersService.updateUserRole(updateData).then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getDeactivatedMembers('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'Aactivate') {
            setLoading(true);
            UsersService.temporarilyDeactivate(data.data[0]?.uuid, '1').then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getDeactivatedMembers('');
                    setLoading(false);
                }
            });
        } else if (data.type === 'search') {
            getDeactivatedMembers(data.data);
        }
    }
    return (
        <>
            {loading &&
                <AppLoader loading={loading}></AppLoader>
            }
            <div>
                <TeamMember membersData={allMembers} onActions={(event) => onActions(event)}></TeamMember>
            </div>
        </>
    )
}
