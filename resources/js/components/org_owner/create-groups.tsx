import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import type {Organization} from "@/types";


export const CreateGroups = ({org} : {org : Organization | null | undefined}) => {
    return <Card className="border-sidebar-border/70">
        <CardHeader>
            <CardTitle>Create study groups for {org?.organization_name}</CardTitle>
            <CardDescription>
                Create study groups for your organization to organize students by class, course, or level. These groups can later be used for assigning materials, managing access, and keeping the learning process structured.
            </CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
    </Card>
}
