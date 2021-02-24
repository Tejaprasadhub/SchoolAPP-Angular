export class Exams {
    id: number;
    title: string;
    year: string;
    createddate: Date;
    createdby: string;
    indexId: number;
    querytype: number;
    status: string;
    subject: string;
    cutoff: string;
    total: string;
    examswisesubjects: examswisesubject[];
    subjects :examclasswisesubjects[];
}

export class examswisesubject {
    subjectid: number;
    subject: string;
    cutoff: number;
    total: number;
}

export class examclasswisesubjectmarks {
    studentId: string;
    classId: number;
    examId: number;
    subjectId: number;
    marks: string;
}

export class examclasswisesubjects {
    classid: number;
    subjectid: number;
    cutoff: number;
    total: number;
}
