import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ParsedCsvUser } from './invite-csv-types';

type InviteCsvUserRowProps = {
    errors: Record<string, string>;
    index: number;
    roleOptions: string[];
    user: ParsedCsvUser;
};

export function InviteCsvUserRow({
    errors,
    index,
    roleOptions,
    user,
}: InviteCsvUserRowProps) {
    return (
        <tr>
            <td className="px-4 py-3 align-top">
                <Input
                    name={`users[${index}][first_name]`}
                    defaultValue={user.first_name}
                />
                <InputError message={errors[`users.${index}.first-name`]} />
            </td>
            <td className="px-4 py-3 align-top">
                <Input
                    name={`users[${index}][last_name]`}
                    defaultValue={user.last_name}
                />
                <InputError message={errors[`users.${index}.last-name`]} />
            </td>
            <td className="px-4 py-3 align-top">
                <Input
                    name={`users[${index}][email]`}
                    type="email"
                    defaultValue={user.email}
                />
                <InputError message={errors[`users.${index}.email`]} />
            </td>
            <td className="px-4 py-3 align-top">
                <Select name={`users[${index}][role]`} defaultValue={user.role}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {roleOptions.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors[`users.${index}.role`]} />
            </td>
        </tr>
    );
}
