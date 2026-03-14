ALTER TABLE menuitems RENAME TO "Menu";
ALTER TABLE "Menu" RENAME COLUMN image_url TO image;
ALTER TABLE "Menu" RENAME COLUMN available TO "isAvailable";
ALTER TABLE "Menu" RENAME COLUMN created_at TO "createdAt";
ALTER TABLE "Menu" RENAME COLUMN updated_at TO "updatedAt";
ALTER TABLE "Menu" ALTER COLUMN price TYPE DOUBLE PRECISION USING price::double precision;