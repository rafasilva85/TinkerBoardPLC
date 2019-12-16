#!/bin/bash

#
# Get script directory
#
base_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

#
# Check instalation options
#
install_apache=0
install_init=0
change_config=0
while getopts "aic" opt $@; do
	case "$opt" in
	a) install_apache=1
	;;
	i) install_init=1
	;;
	c) change_config=1
	;;
	[?]) echo "Invalid parameter" 1>&2
	     exit 1;;
	esac
done


#
# check if current user is root (sudo)
#
issudo=1
if [[ $(id -u) -ne 0 ]] ; then 
	issudo=0; 
fi

#
# Install and configure Apache
#
if [ $install_apache -eq 1 ] ; then
	#
	# If user is root, install and configure Apache
	#
	if [ $issudo -ne 1 ] ; then
		echo "You must be root to configure Apache";
	else
		# 
		# Install Apache if it is not already installed.
		# 
		if [ $(dpkg-query -W -f='${Status}'  apache2 2> /dev/null| grep -c "ok installed") -eq 0 ]; then
			echo -e "Installing Apache"
			apt-get install apache2
		fi

		#
		# Enabling CGI module in Apache
			#--- Checking if the ServerName configuration is enabled on apache2.config
			if ! grep -q 'ServerName' "/etc/apache2/apache2.conf"; then
				sudo sh -c 'echo "ServerName localhost" >> /etc/apache2/apache2.conf'
			fi

		echo -e "Enabling CGI module in Apache... \n"
		a2enmod cgi


		#
		# Try to find Apache document root
		#
		filelist=(/etc/apache2/sites-enabled/*)
		doc_root=""
		for conf_file in "${filelist[@]}"
		do
		  doc_root="$(grep -i 'DocumentRoot' $conf_file | cut -d ' ' -f2)"
		  if [ ! -z "$doc_root" ]; then
			break
		  fi
		done

		#
		# Try to find Apache cgi directory
		#
		cgi_bin=""
		filelist=(/etc/apache2/sites-enabled/*)
		for cgi_bin_file in "${filelist[@]}"
		do
		  cgi_bin="$(grep -i 'ScriptAlias /cgi-bin' $cgi_bin_file | cut -d ' ' -f3)"
		  if [ ! -z "$cgi_bin" ]; then
			break
		  fi
		done
		if [ -z "$cgi_bin" ]; then
			filelist=(/etc/apache2/conf-enabled/*)
			for cgi_bin_file in "${filelist[@]}"
			do
			  cgi_bin="$(grep -i 'ScriptAlias /cgi-bin' $cgi_bin_file | cut -d ' ' -f3)"
			  if [ ! -z "$cgi_bin" ]; then
				break
			  fi
			done
		fi

		if [ -z "$doc_root" ]; then
			echo "Apache document root could not be found."
		fi
		if [ -z "$cgi_bin" ]; then
			echo "Apache cgi-bin directory could not be found."
		fi
		if [ -z "$doc_root" -o -z "$cgi_bin" ]; then
			echo "Apache configuration aborted"
		else
			echo "Html files will be linked to Apache document root: $doc_root"
			echo -e "CGI files will be linked to Apache cgi-bin directory: $cgi_bin\n"

			#
			# Copy MA to document root
			#
			echo -e "\n"
			echo -e "- Linking $base_dir/MA to $doc_root/MA"
			doc_root_MA=$doc_root/MA
			if [ -d $doc_root_MA ] || [ -a $doc_root_MA ];
			then
				rm -r $doc_root_MA
			fi

			ln -s $base_dir/MA $doc_root_MA			

			#
			# Copy WebCGIProc to cgi directory
			#
			echo -e "- Copying $base_dir/webaddon/CGI/WebCGIProc to $cgi_bin"
			
			# Remove the last slash from the path if present
			cgi_bin="${cgi_bin%/}"
			if [ -f "$cgi_bin/WebCGIProc" ];
			then
				rm -r $cgi_bin/WebCGIProc
			fi

			cp $base_dir/webaddon/CGI/WebCGIProc $cgi_bin/WebCGIProc
			chmod a+x $cgi_bin/WebCGIProc			
		fi
	fi
fi
if [ $change_config -eq 1 ] ; then
	#
	# Update config.js with new service location
	#
	echo -e "- Updating MA/sma/config.js with new service location: /cgi-bin/WebCGIProc"
	sed -i 's/"service"/"\/cgi-bin\/WebCGIProc"/g' $base_dir/MA/sma/config.js
fi

#
# Configure initialization of Remote Agent
#/
if [ $install_init -eq 1 ] ; then
	if [ $issudo -ne 1 ] ; then
		echo "You must be root to configure Remote Agent initialization";
	else
		cp $base_dir/remote-agent.sh /etc/init.d/remote-agent
		chmod a+x /etc/init.d/remote-agent
		eval "sed -i s#REMOTEAGENTPATH=\/iotview#REMOTEAGENTPATH=$base_dir#g /etc/init.d/remote-agent"
		update-rc.d -f remote-agent remove
		update-rc.d remote-agent defaults 99

		echo -e " - The Remote Agent will be running as service. "
		echo -e "   The log file will be located in the directory /var/log/"
	fi
fi

echo -e " - Installation completed."


