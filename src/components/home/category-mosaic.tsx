import Image from "next/image";
import Link from "next/link";
import type { EditorialTile } from "@/lib/home-editorial";

const toneClass: Record<EditorialTile["tone"], string> = {
  night: "bg-night text-ivory",
  sage: "bg-sage text-ink",
  rose: "bg-rose text-ink",
  stone: "bg-stone text-ink",
  paper: "bg-paper text-ink",
};

export function CategoryMosaic({ tiles }: { tiles: EditorialTile[] }) {
  if (tiles.length === 0) return null;
  return (
    <div id="categorias" className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((tile, index) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group relative flex min-h-52 flex-col justify-end overflow-hidden p-5 ${index === 0 ? "col-span-2 min-h-80 md:row-span-2 md:min-h-[34rem]" : ""} ${toneClass[tile.tone]}`}
        >
          {tile.image ? (
            <Image
              src={tile.image}
              alt=""
              fill
              sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              className="object-cover transition duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
            />
          ) : null}
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
          <span className="relative text-ivory">
            <span className="block font-serif text-3xl leading-none md:text-4xl">{tile.title}</span>
            <span className="mt-2 block max-w-[16rem] text-sm leading-5 text-ivory/90">{tile.text}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
