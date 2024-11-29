CREATE OR REPLACE FUNCTION get_booking_stats()
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    result json;
BEGIN
    WITH monthly_trends AS (
        SELECT 
            date_trunc('month', departure_date) as month,
            COUNT(*) as count
        FROM bookings
        WHERE departure_date >= date_trunc('month', current_date - interval '4 months')
        GROUP BY month
        ORDER BY month DESC
        LIMIT 5
    ),
    destination_stats AS (
        SELECT 
            destination as id,
            COUNT(*) as value
        FROM bookings
        GROUP BY destination
        ORDER BY count(*) DESC
        LIMIT 5
    )
    SELECT json_build_object(
        'trends', (
            SELECT json_agg(
                json_build_object(
                    'x', to_char(month, 'Mon'),
                    'y', count
                )
            )
            FROM monthly_trends
        ),
        'destinations', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'value', value
                )
            )
            FROM destination_stats
        )
    ) INTO result;

    RETURN result;
END;
$$;