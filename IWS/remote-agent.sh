#! /bin/sh
### BEGIN INIT INFO
# Provides:          remote-agent
# Required-Start:    $all
# Required-Stop:     
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start/Stop Remote Agent
### END INIT INFO

# Change REMOTEAGENTPATH to match your installation
REMOTEAGENTPATH=/iotview
REMOTEAGENTNAME=RemoteAgent


PATH=${PATH}:$REMOTEAGENTPATH
DESC="Remote Agent"
NAME=remote-agent
DAEMON=$REMOTEAGENTPATH/$REMOTEAGENTNAME
DAEMON_ARGS="-start_runtime"
PIDFILE=/var/run/$REMOTEAGENTNAME.pid
SCRIPTNAME=/etc/init.d/$NAME
LOGFILE=/var/log/$REMOTEAGENTNAME.log


# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

do_start()
{
	# Return
	#   0 if daemon has been started
	#   1 if daemon was already running
	#   2 if daemon could not be started	
	echo ""
	echo "*** $DESC ***"
	echo "The $DESC is running as a service."
	echo "$DESC log file: $LOGFILE"
	echo "*************"
	echo ""

	start-stop-daemon --start --background --no-close --quiet -m --pidfile $PIDFILE --exec $DAEMON --test > /dev/null || return 1
	start-stop-daemon --start --background --no-close --quiet -m --pidfile $PIDFILE --exec $DAEMON -- $DAEMON_ARGS > $LOGFILE 2>&1 || return 2
}

do_stop()
{
	# Return
	#   0 if daemon has been stopped
	#   1 if daemon was already stopped
	#   2 if daemon could not be stopped
	#   other if a failure occurred
	start-stop-daemon --stop --quiet --retry=INT/5/INT/30/INT/60/KILL/5 --pidfile $PIDFILE --name $REMOTEAGENTNAME
	RETVAL="$?"
	[ "$RETVAL" = 2 ] && return 2
	rm -f $PIDFILE
	return "$RETVAL"
}


case "$1" in
  start)
	do_start
	;;
  stop)
	do_stop
	;;
  restart|force-reload)
	do_stop
	case "$?" in
	  0|1)
		do_start
		;;
	  *)
		# Failed to stop
		;;
	esac
	;;
  *)
	echo "Usage: $SCRIPTNAME {start|stop|restart|force-reload}" >&2
	exit 3
	;;
esac

:
