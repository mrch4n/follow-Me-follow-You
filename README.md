# Follow Me Follow You
## Description:
No register, no login

Share your realtime location with your friends on Google Map by a simply one click.

## Update
2017-02-27
- Init release of multi-peer mode.

2017-02-14
- Added 'High Accuracy' and 'Update Frequency' in settings.
- File name corrected.
- Added missing information in SQL setup file(fmfu.sql).

2017-02-12
- Added accuracy to markers
- Hide session ID on front-end.
- U-marker now updates periodically.

## Screenshots

![alt tag](https://github.com/mrch4n/follow-Me-follow-You/blob/master/screenshot/fmfu-1.png)

![alt tag](https://github.com/mrch4n/follow-Me-follow-You/blob/master/screenshot/fmfu-2.png)

## Server Setup

PHP, MySQL

Run the fmfu.sql to create the needed database table.

Fill in required information and rename 'int/fmfu.config-example.php' to 'int/fmfu.config.php'

Google Map Javascript API Key is required. (int/fmfu.config.php)

HTTPS is required to acquire location on some browser. ( https://goo.gl/rStTGz )
