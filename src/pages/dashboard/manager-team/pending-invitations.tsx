import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { UsersListItem } from '../../../app/model/users/users-list';
import { UsersService } from '../../../app/service/users.service';
import { AppLoader } from '../../../components/loader';
import TeamMember from '../../../components/team-membe';

export const PendingInvitationsMembers = () => {
    const [allMembers, setAllMembers] = useState<UsersListItem[] | []>([]);
    const companyUuid = sessionStorage.getItem('company_uuid') || '';
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPendingInvitation();
    }, []);

    const getPendingInvitation = () => {
        setLoading(true);
        UsersService.getPendingInvitation(companyUuid).then(res => {
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
                        getPendingInvitation();
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
                    getPendingInvitation();
                    setLoading(false);
                }
            });
        } else if (data.type === 'temporarilyDeactivate') {
            setLoading(true);
            UsersService.temporarilyDeactivate(data.data[0]?.uuid, '1').then(res => {
                if (res.error) {
                    toast.error(res?.error?.message);
                    setLoading(false);
                } else {
                    getPendingInvitation();
                    setLoading(false);
                }
            });
        }
        else if (data.type === 'search') {
            // allUsers(data.data);
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
