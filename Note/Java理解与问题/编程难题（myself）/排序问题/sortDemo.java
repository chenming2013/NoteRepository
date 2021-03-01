//将一个字符串按照字母的ascii码顺序排序，其他非字母字符在字符串中位置不变
class SortDemo 
{
	public static void main(String[] args) 
	{
		String str = "neiry92hn 0r9c3y#(&4342-34u c4MLU";   //这是一个包含了字母、数字、空格、特殊字符的字符串
		char[] arr = str.toCharArray();
		
		//这是为了与之后的输出样式做对比，特意输出的，不是必须的
		for(int i=0;i<arr.length;i++)
		{
			System.out.print(arr[i]+" ");
		}
		
		for(int i=0;i<arr.length-1;i++)
		{
			for(int j=i+1;j<arr.length;j++)
			{
				if(arr[i]>=65&&arr[i]<=90 || arr[i]>=97&&arr[i]<=122)  //判断是否是字母
				{
					if(arr[j]>=65&&arr[j]<=90 || arr[j]>=97&&arr[j]<=122)  //判断是否是字母
					{
						if(arr[i]>arr[j])
						{
							char temp = arr[i];
							arr[i] = arr[j];
							arr[j] = temp;
						}
					}
				}
				else
				{
					break;
				}
			}
		}

		System.out.println();

		for(int i=0;i<arr.length;i++)
		{
			System.out.print(arr[i]+" ");
		}
	}
}