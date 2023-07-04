#!/usr/bin/env bash

cd /home/work/podium-web
tar -zxvf podium-web-pkg.tar.gz
chown -R work:work /home/work/podium-web/
cp ./podium-web.service /etc/systemd/system/

systemctl daemon-reload
systemctl restart podium-web
systemctl status podium-web