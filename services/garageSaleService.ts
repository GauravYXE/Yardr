// services/garageSaleService.ts
import { supabase } from "@/lib/supabase";
import { GarageSale } from "@/types/garageSale";

/* ─── Logging helper ─────────────────────────────────────────────────────── */
const logSupabaseError = (context: string, error: any) => {
	console.error(`🔴 Supabase Error in ${context}`);
	console.error("Message:", error?.message);
	console.error("Code:", error?.code);
	console.error("Details:", error?.details);
	console.error("Hint:", error?.hint);
};

/* ─── DB row type ────────────────────────────────────────────────────────── */
interface GarageSaleRow {
	id: string;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	address: string;
	date: string;
	start_date: string;
	end_date: string;
	start_time: string;
	end_time: string;
	categories: string[];
	contact_name: string;
	contact_phone: string | null;
	contact_email: string | null;
	images: string[] | null;
	video_url: string | null;
	is_active: boolean;
	created_at: string;
	user_id: string | null;
	device_id?: string | null;
}

/* ─── Mapper ─────────────────────────────────────────────────────────────── */
const mapRowToGarageSale = (row: GarageSaleRow): GarageSale => ({
	id: row.id,
	title: row.title,
	description: row.description,
	location: {
		latitude: row.latitude,
		longitude: row.longitude,
		address: row.address,
	},
	date: row.date,
	startDate: row.start_date || row.date,
	endDate: row.end_date || row.date,
	startTime: row.start_time,
	endTime: row.end_time,
	categories: row.categories,
	contactName: row.contact_name,
	contactPhone: row.contact_phone || undefined,
	contactEmail: row.contact_email || undefined,
	images: row.images || undefined,
	videoUrl: row.video_url || undefined,
	isActive: row.is_active,
	createdAt: row.created_at,
	userId: row.user_id || undefined,
});

/* ─── Service ────────────────────────────────────────────────────────────── */
export const garageSaleService = {
	/* ── Read all ── */
	getAllGarageSales: async (): Promise<GarageSale[]> => {
		try {
			const { data, error } = await supabase
				.from("garage_sales")
				.select("*")
				.eq("is_active", true)
				.order("date", { ascending: true });

			if (error) {
				logSupabaseError("getAllGarageSales", error);
				throw new Error(error.message);
			}

			return (data || []).map(mapRowToGarageSale);
		} catch (error: any) {
			console.error("🔴 Runtime Error in getAllGarageSales:", error?.message);
			throw error;
		}
	},

	/* ── Read nearby ── */
	getGarageSalesNearby: async (
		latitude: number,
		longitude: number,
		radiusKm = 10,
	): Promise<GarageSale[]> => {
		try {
			const { data, error } = await supabase
				.from("garage_sales")
				.select("*")
				.eq("is_active", true);

			if (error) {
				logSupabaseError("getGarageSalesNearby", error);
				throw new Error(error.message);
			}

			return (data || []).map(mapRowToGarageSale).filter((sale) => {
				const dist = calculateDistance(
					{ latitude, longitude },
					{
						latitude: sale.location.latitude,
						longitude: sale.location.longitude,
					},
				);
				return dist <= radiusKm;
			});
		} catch (error: any) {
			console.error(
				"🔴 Runtime Error in getGarageSalesNearby:",
				error?.message,
			);
			throw error;
		}
	},

	/* ── Read by ID ── */
	getGarageSaleById: async (id: string): Promise<GarageSale | null> => {
		try {
			const { data, error } = await supabase
				.from("garage_sales")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				logSupabaseError("getGarageSaleById", error);
				throw new Error(error.message);
			}

			return data ? mapRowToGarageSale(data) : null;
		} catch (error: any) {
			console.error("🔴 Runtime Error in getGarageSaleById:", error?.message);
			return null;
		}
	},

	/* ── Get sales for a specific user (My Sales screen) ── */
	getMySales: async (userId: string): Promise<GarageSale[]> => {
		try {
			const { data, error } = await supabase
				.from("garage_sales")
				.select("*")
				.eq("user_id", userId)
				.eq("is_active", true)
				.order("created_at", { ascending: false });

			if (error) {
				logSupabaseError("getMySales", error);
				throw new Error(error.message);
			}

			return (data || []).map(mapRowToGarageSale);
		} catch (error: any) {
			console.error("🔴 Runtime Error in getMySales:", error?.message);
			throw error;
		}
	},

	/* ── Create ── */
	addGarageSale: async (
		sale: Omit<GarageSale, "id" | "createdAt">,
		deviceId?: string,
		userId?: string,
	): Promise<GarageSale> => {
		try {
			const insertData: any = {
				title: sale.title,
				description: sale.description,
				latitude: sale.location.latitude,
				longitude: sale.location.longitude,
				address: sale.location.address,
				date: sale.startDate || sale.date,
				start_date: sale.startDate || sale.date,
				end_date: sale.endDate || sale.startDate || sale.date,
				start_time: sale.startTime,
				end_time: sale.endTime,
				categories: sale.categories,
				contact_name: sale.contactName,
				contact_phone: sale.contactPhone || null,
				contact_email: sale.contactEmail || null,
				images: sale.images || null,
				video_url: sale.videoUrl || null,
				is_active: sale.isActive,
				user_id: userId || null,
				device_id: deviceId || null,
			};

			const { data, error } = await supabase
				.from("garage_sales")
				.insert([insertData])
				.select()
				.single();

			if (error) {
				logSupabaseError("addGarageSale", error);
				throw new Error(error.message);
			}

			return mapRowToGarageSale(data);
		} catch (error: any) {
			console.error("🔴 Runtime Error in addGarageSale:", error?.message);
			throw error;
		}
	},

	/* ── Update ── */
	updateGarageSale: async (
		id: string,
		updates: Partial<{
			title: string;
			description: string;
			contactName: string;
			contactPhone: string;
			contactEmail: string;
			videoUrl: string;
			isActive: boolean;
		}>,
	): Promise<void> => {
		try {
			// Map GarageSale field names → DB column names
			const dbUpdates: Record<string, any> = {};
			if (updates.title !== undefined) dbUpdates.title = updates.title;
			if (updates.description !== undefined)
				dbUpdates.description = updates.description;
			if (updates.contactName !== undefined)
				dbUpdates.contact_name = updates.contactName;
			if (updates.contactPhone !== undefined)
				dbUpdates.contact_phone = updates.contactPhone;
			if (updates.contactEmail !== undefined)
				dbUpdates.contact_email = updates.contactEmail;
			if (updates.videoUrl !== undefined)
				dbUpdates.video_url = updates.videoUrl;
			if (updates.isActive !== undefined)
				dbUpdates.is_active = updates.isActive;

			const { error } = await supabase
				.from("garage_sales")
				.update(dbUpdates)
				.eq("id", id);

			if (error) {
				logSupabaseError("updateGarageSale", error);
				throw new Error(error.message);
			}
		} catch (error: any) {
			console.error("🔴 Runtime Error in updateGarageSale:", error?.message);
			throw error;
		}
	},

	/* ── Soft-delete (deactivate) ── */
	deleteGarageSale: async (id: string): Promise<void> => {
		try {
			const { error } = await supabase
				.from("garage_sales")
				.update({ is_active: false })
				.eq("id", id);

			if (error) {
				logSupabaseError("deleteGarageSale", error);
				throw new Error(error.message);
			}
		} catch (error: any) {
			console.error("🔴 Runtime Error in deleteGarageSale:", error?.message);
			throw error;
		}
	},

	/* ── Claim device sales after login ── */
	// Calls the Postgres function defined in your SQL migration.
	// Associates all anonymous device sales with the now-authenticated user.
	claimDeviceSales: async (deviceId: string): Promise<number> => {
		try {
			const { data, error } = await supabase.rpc("claim_device_sales", {
				p_device_id: deviceId,
			});

			if (error) {
				logSupabaseError("claimDeviceSales", error);
				// Don't throw — this is non-critical; the user is still logged in.
				return 0;
			}

			return (data as number) || 0;
		} catch (error: any) {
			console.error("🔴 Runtime Error in claimDeviceSales:", error?.message);
			return 0;
		}
	},
};

/* ─── Standalone exports used by my-sales.tsx ────────────────────────────── */
export const getMySales = garageSaleService.getMySales;
export const deleteSale = garageSaleService.deleteGarageSale;

/* ─── Distance helper ────────────────────────────────────────────────────── */
const calculateDistance = (
	point1: { latitude: number; longitude: number },
	point2: { latitude: number; longitude: number },
): number => {
	const R = 6371;
	const dLat = toRad(point2.latitude - point1.latitude);
	const dLon = toRad(point2.longitude - point1.longitude);
	const lat1 = toRad(point1.latitude);
	const lat2 = toRad(point2.latitude);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

const toRad = (value: number): number => (value * Math.PI) / 180;
