import { MapPin, Briefcase, Clock, Mail } from "lucide-react";
import jobsJson from "@/data/catalog/jobs.json";
import type { Locale } from "@/lib/i18n/routing";

type Job = {
  slug: string;
  title: { tr: string; en: string };
  location: { tr: string; en: string };
  department: { tr: string; en: string };
  experience: { tr: string; en: string };
  type: { tr: string; en: string };
  skills: { tr: string[]; en: string[] };
};

/**
 * Kariyer pozisyonları: başlık, konum, bölüm, deneyim, aranan yetkinlikler.
 * Başvuru formu yoktur; başvuru e-posta ile yapılır.
 */
export default function JobList({
  locale,
  labels,
}: {
  locale: Locale;
  labels: {
    location: string;
    department: string;
    experience: string;
    skills: string;
    apply: string;
    applySubject: (position: string) => string;
    applyNote: string;
    empty: string;
  };
}) {
  const jobs = jobsJson.jobs as Job[];

  if (!jobs.length) {
    return <p className="section-desc">{labels.empty}</p>;
  }

  return (
    <div className="job-list">
      {jobs.map((job, index) => (
        <article className="job-item reveal" data-reveal="up" key={`${job.slug}-${index}`}>
          <div className="job-item__head">
            <h3>{job.title[locale]}</h3>
            <p className="job-item__meta">
              <span>
                <MapPin size={15} aria-hidden="true" /> {job.location[locale]}
              </span>
              <span>
                <Briefcase size={15} aria-hidden="true" />{" "}
                {job.department[locale]}
              </span>
              <span>
                <Clock size={15} aria-hidden="true" /> {job.experience[locale]}
              </span>
              <span>{job.type[locale]}</span>
            </p>
          </div>
          <div className="job-item__body">
            <h4 className="job-item__skills-title">{labels.skills}</h4>
            <ul className="job-item__skills">
              {job.skills[locale].map((skill, skillIndex) => (
                <li key={`${index}-${skillIndex}`}>{skill}</li>
              ))}
            </ul>
            <a
              className="btn btn-sm btn-primary"
              href={`mailto:bilgi@mirais.com.tr?subject=${encodeURIComponent(
                labels.applySubject(job.title[locale]),
              )}&body=${encodeURIComponent(labels.applyNote)}`}
            >
              <Mail size={15} aria-hidden="true" /> {labels.apply}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
