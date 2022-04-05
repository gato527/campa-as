find harinera -type d -print0 | xargs -0 chmod 0755
find harinera -type f -print0 | xargs -0 chmod 0644


TZ=America/Bogota node  /home/dowesoftadmin/canal-de-televentas/sync_order.js &> /dev/null