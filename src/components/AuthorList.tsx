import { Facehash } from "facehash";
import Link from "next/link";

function slugToName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AuthorList({ authors }: { authors: string[] }) {
  if (!authors || authors.length === 0) return <span>Unknown Author</span>;

  return (
    <span>
      {authors.map((author, i) => (
        <span key={author}>
          <Facehash
            name={author}
            intensity3d="dramatic"
            colors={["#cdda53", "#f8ef69", "#72589f", "#be629f"]}
            size={20}
            enableBlink
          />
          <Link href={`/people/${author}`}>{slugToName(author)}</Link>
          {i < authors.length - 1 && ", "}
        </span>
      ))}
    </span>
  );
}
