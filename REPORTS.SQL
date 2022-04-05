SELECT 

cl.client_code,

cl.name,
cl.nit,
cl.business_name,
cl.address,
cl.neighborhood,
cl.city,
cr.date,
cr.type,
ob.detail,
cl.route,
cr.state



FROM call_report cr

LEFT JOIN client cl on cr.client = cl.id
LEFT JOIN observation ob on ob.call_report = cl.id

UNION ALL 

SELECT 

cl.client_code,
cl.name,
cl.nit,
cl.business_name,
cl.address,
cl.neighborhood,
cl.city,
cr.date,
cr.type,
ob.detail,
cl.route,
cr.state

 FROM call_report cr 

RIGHT JOIN client cl on cr.client = cl.id
RIGHT JOIN observation ob on ob.call_report = cl.id


ORDER BY state



SELECT 
        
        cl.client_code,
        cl.name client_name,
        cl.nit,
        cl.business_name,
        cl.address,
        cl.neighborhood,
        cl.city,
        cr.date,
        cr.hour,
        cr.type causal,
        cl.route,
        cl.seller_code,
        cr.state,
        cr.id


        FROM call_report cr

        INNER JOIN client cl on cr.client = cl.id 
		

        WHERE cr.date ='2018-08-29' ORDER BY client_code;


        SELECT 
         DATE(p.created_at) fecha,
         quantity, 
         p.price,
         (quantity*p.price ) totalventa,
         p.price_base,
         p.price_iva,
         p.iva,
         p.sap_code,
         c.city,
         c.day,
         c.client_code,
         c.typebusinnes,
         ap.Nombre 

         FROM product_order_products p JOIN client c on p.client = c.id join aproductos ap on ap.Codigo = p.sap_code WHERE p.created_at BETWEEN '2020-10-01 00:00:00.000000' AND '2020-10-31 00:00:00.000000'



        totalventa  cantidad * precio
        fecha
        linea