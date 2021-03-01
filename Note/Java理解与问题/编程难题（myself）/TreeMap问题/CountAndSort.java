import java.util.Scanner;
import java.util.TreeMap;
import java.util.Set;
import java.util.Comparator;
public class CountAndSort
{
	public static void main(String[] args)
	{
				System.out.println("请输入整数的个数：");
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        TreeMap<Integer,Integer> tm = new TreeMap<Integer,Integer>(new MyComparator());
		if (n <= 1000)
		{
			for (int i = 0; i < n; i++)
			{
				int number = (int) (1000 * Math.random())+1;
				if (!tm.containsKey(number))
				{
					tm.put(number, 1);
				}
			}
		}
		System.out.println(tm.size());
		Set set = tm.keySet();
		System.out.println(set);
    }
	static class MyComparator implements Comparator<Integer>
	{
		
		public int compare(Integer o1, Integer o2)
		{
			// TODO Auto-generated method stub
			return o1-o2;
		}
	}
}