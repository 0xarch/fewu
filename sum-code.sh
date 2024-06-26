#!/bin/bash
COUNT=0
COUNT_CHAR=0
function sum(){
	for element in $(ls $1)
	do
		dir_or_file=$1"/"$element
		if [ -d $dir_or_file ]; then
			sum $dir_or_file
		else
			COUNT=`expr $COUNT + $(wc -l $dir_or_file | awk '{print $1}')`
			COUNT_CHAR=`expr $COUNT_CHAR + $(wc -m $dir_or_file | awk '{print $1}')`
		fi
	done
}

sum _src
echo $COUNT lines, $COUNT_CHAR characters.
