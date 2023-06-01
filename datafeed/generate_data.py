from random import normalvariate, random
from datetime import timedelta, datetime
import csv
import dateutil.parser

MARKET_OPEN = datetime.today().replace(hour=0, minute=30, second=0)
SIM_LENGTH = timedelta(days=365 * 5)


def bwalk(min_val, max_val, std):
    """ Generates a bounded random walk. """
    rng = max_val - min_val
    while True:
        max_val += normalvariate(0, std)
        yield abs((max_val % (rng * 2)) - rng) + min_val


def market(t0=MARKET_OPEN):
    """ Generates a random series of market conditions, (time, price, spread). """
    for hours, px, spd in zip(bwalk(12, 36, 50), bwalk(60.0, 150.0, 1), bwalk(2.0, 6.0, 0.1)):
        yield t0, px, spd
        t0 += timedelta(hours=abs(hours))


def generate_csv():
    """ Generate a CSV of order history. """
    with open('test.csv', 'w') as f:
        writer = csv.writer(f)
        for t, px, spd in market():
            if t > MARKET_OPEN + SIM_LENGTH:
                break
            writer.writerow([t, 'ABC' if random() > 0.5 else 'DEF', 'sell' if random() > 0.5 else 'buy', round(px + (spd / -2 if random() > 0.5 else 2), 2), int(abs(normalvariate(0, 100)))])


if __name__ == '__main__':
    print("Generating data...")
    generate_csv()
    print("Data generation completed.")
