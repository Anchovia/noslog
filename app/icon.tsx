import { createBrandIcon } from "@/lib/metadata/brand-image";

export const size = {
    width: 512,
    height: 512,
};

export const contentType = "image/png";

export default function Icon() {
    return createBrandIcon(size.width);
}
