import React from 'react';

export interface ProfileMenuSectionTitleProps {
    label: string;
}

export const ProfileMenuSectionTitle = ({ label }: ProfileMenuSectionTitleProps) => (
    <div className="px-4 py-2">
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] italic">
            {label}
        </p>
    </div>
);
